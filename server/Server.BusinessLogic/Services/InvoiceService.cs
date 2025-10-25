using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.BusinessLogic.Services;

public class InvoiceService : IInvoiceService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<InvoiceService> _logger;

    public InvoiceService(ApplicationDbContext context, ILogger<InvoiceService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        
        try
        {
            // Verify customer exists
            var customerExists = await _context.CustomersDb.AnyAsync(c => c.CustomerId == request.CustomerId);
            if (!customerExists)
            {
                throw new ArgumentException($"Customer with ID {request.CustomerId} not found");
            }

            // Create the invoice entity
            var invoice = new InvoiceEntity
            {
                CreatedAt = DateTime.Now,
                CustomerId = request.CustomerId,
                StartedAt = request.StartedAt ?? DateTime.Now,
                FinishedAt = request.FinishedAt ?? DateTime.Now,
                DepositAmount = request.DepositAmount.HasValue ? (double)request.DepositAmount.Value : 0,
                DepositPaidOn = request.DepositPaidOn ?? DateTime.Parse("1111-11-11"),
                Type = request.Type,
                InvoicePositions = new List<InvoicePosition>()
            };

            double totalAmount = 0;

            // Process each position
            foreach (var positionRequest in request.Positions)
            {
                PositionEntity position;

                // Check if we need to create a new position or use an existing one
                if (positionRequest.PositionId.HasValue && positionRequest.PositionId.Value > 0)
                {
                    // Use existing position
                    position = await _context.PositionsDb.FindAsync(positionRequest.PositionId.Value);
                    if (position == null)
                    {
                        throw new ArgumentException($"Position with ID {positionRequest.PositionId} not found");
                    }
                }
                else
                {
                    // Create new position inline
                    if (string.IsNullOrWhiteSpace(positionRequest.Text) || 
                        !positionRequest.Price.HasValue || 
                        string.IsNullOrWhiteSpace(positionRequest.Unit))
                    {
                        throw new ArgumentException("Position data (Text, Price, Unit) is required when PositionId is not provided");
                    }

                    position = new PositionEntity
                    {
                        Text = positionRequest.Text,
                        Price = positionRequest.Price.Value,
                        Unit = positionRequest.Unit
                    };
                    
                    _context.PositionsDb.Add(position);
                    await _context.SaveChangesAsync(); // Save to get the ID
                }

                // Calculate line total
                double lineTotal = position.Price * (double)positionRequest.Amount;
                totalAmount += lineTotal;

                // Create invoice position linking
                var invoicePosition = new InvoicePosition
                {
                    PositionId = position.PositionId,
                    Amount = (double)positionRequest.Amount
                };

                invoice.InvoicePositions.Add(invoicePosition);
            }

            // Save the invoice
            _context.InvoicesDb.Add(invoice);
            await _context.SaveChangesAsync();
            
            await transaction.CommitAsync();

            _logger.LogInformation("Invoice {InvoiceId} created successfully", invoice.InvoiceId);

            // Fetch and return the complete invoice with relationships
            var createdInvoice = await _context.InvoicesDb
                .Include(i => i.Customer)
                .Include(i => i.InvoicePositions)
                    .ThenInclude(ip => ip.Position)
                .Where(i => i.InvoiceId == invoice.InvoiceId)
                .Select(i => new InvoiceDto
                {
                    InvoiceId = i.InvoiceId,
                    CreatedAt = i.CreatedAt,
                    CustomerId = i.CustomerId,
                    StartedAt = i.StartedAt,
                    FinishedAt = i.FinishedAt,
                    DepositAmount = i.DepositAmount,
                    DepositPaidOn = i.DepositPaidOn,
                    Type = i.Type,
                    Customer = i.Customer == null ? null : new CustomerDto
                    {
                        CustomerId = i.Customer.CustomerId,
                        Firstname = i.Customer.Firstname,
                        Surname = i.Customer.Surname,
                        Plz = i.Customer.Plz,
                        City = i.Customer.City,
                        Address = i.Customer.Address,
                        Nr = i.Customer.Nr,
                        Uid = i.Customer.Uid
                    },
                    Positions = i.InvoicePositions!.Select(ip => new InvoicePositionDto
                    {
                        InvoicePositionId = ip.InvoicePositionId,
                        Amount = ip.Amount,
                        PositionId = ip.PositionId,
                        Position = ip.Position == null ? null : new PositionDto
                        {
                            PositionId = ip.Position.PositionId,
                            Text = ip.Position.Text,
                            Price = ip.Position.Price,
                            Unit = ip.Position.Unit
                        }
                    }).ToList()
                })
                .FirstAsync();

            return createdInvoice;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error creating invoice");
            throw;
        }
    }
}
