using Microsoft.Extensions.Logging;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Invoice;

namespace Server.BusinessLogic.Invoice;

public class InvoiceBusinessLogic : IInvoiceBusinessLogic
{
    private readonly IInvoiceDataAccess _invoiceDataAccess;
    private readonly ILogger<InvoiceBusinessLogic> _logger;

    public InvoiceBusinessLogic(
        IInvoiceDataAccess invoiceDataAccess,
        ILogger<InvoiceBusinessLogic> logger)
    {
        _invoiceDataAccess = invoiceDataAccess;
        _logger = logger;
    }

    public async Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync()
    {
        var invoices = await _invoiceDataAccess.GetAllInvoicesAsync();
        return invoices.Select(MapToDto);
    }

    public async Task<InvoiceDto?> GetInvoiceByIdAsync(int invoiceId)
    {
        var invoice = await _invoiceDataAccess.GetInvoiceByIdAsync(invoiceId);
        return invoice != null ? MapToDto(invoice) : null;
    }

    public async Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceRequest request)
    {
        // Verify customer exists
        var customerExists = await _invoiceDataAccess.CustomerExistsAsync(request.CustomerId);
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

        // Process each position
        foreach (var positionRequest in request.Positions)
        {
            PositionEntity? position;

            // Check if we need to create a new position or use an existing one
            if (positionRequest.PositionId.HasValue && positionRequest.PositionId.Value > 0)
            {
                // Use existing position
                position = await _invoiceDataAccess.GetPositionByIdAsync(positionRequest.PositionId.Value);
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
                
                position = await _invoiceDataAccess.CreatePositionAsync(position);
            }

            // Create invoice position linking
            var invoicePosition = new InvoicePosition
            {
                Position = position,
                Amount = (double)positionRequest.Amount
            };

            invoice.InvoicePositions.Add(invoicePosition);
        }

        // Save the invoice
        var createdInvoice = await _invoiceDataAccess.CreateInvoiceAsync(invoice);
        _logger.LogInformation("Invoice {InvoiceId} created successfully", createdInvoice.InvoiceId);

        // Fetch the complete invoice with relationships
        var invoiceWithRelations = await _invoiceDataAccess.GetInvoiceByIdAsync(createdInvoice.InvoiceId);
        
        return MapToDto(invoiceWithRelations!);
    }

    public async Task<InvoiceDto> UpdateInvoiceAsync(int invoiceId, UpdateInvoiceRequest request)
    {
        var invoice = await _invoiceDataAccess.GetInvoiceByIdAsync(invoiceId);
        if (invoice == null)
        {
            throw new ArgumentException($"Invoice with ID {invoiceId} not found");
        }

        // Verify customer exists
        var customerExists = await _invoiceDataAccess.CustomerExistsAsync(request.CustomerId);
        if (!customerExists)
        {
            throw new ArgumentException($"Customer with ID {request.CustomerId} not found");
        }

        // Update invoice fields
        invoice.CustomerId = request.CustomerId;
        invoice.StartedAt = request.StartedAt ?? invoice.StartedAt;
        invoice.FinishedAt = request.FinishedAt ?? invoice.FinishedAt;
        invoice.DepositAmount = request.DepositAmount.HasValue ? (double)request.DepositAmount.Value : invoice.DepositAmount;
        invoice.DepositPaidOn = request.DepositPaidOn ?? invoice.DepositPaidOn;
        invoice.Type = request.Type;

        // Note: For simplicity, we're not updating positions in this implementation
        // A full implementation would handle adding/removing/updating positions

        var updatedInvoice = await _invoiceDataAccess.UpdateInvoiceAsync(invoice);
        _logger.LogInformation("Invoice {InvoiceId} updated", updatedInvoice.InvoiceId);

        var invoiceWithRelations = await _invoiceDataAccess.GetInvoiceByIdAsync(updatedInvoice.InvoiceId);
        return MapToDto(invoiceWithRelations!);
    }

    public async Task DeleteInvoiceAsync(int invoiceId)
    {
        var exists = await _invoiceDataAccess.InvoiceExistsAsync(invoiceId);
        if (!exists)
        {
            throw new ArgumentException($"Invoice with ID {invoiceId} not found");
        }

        await _invoiceDataAccess.DeleteInvoiceAsync(invoiceId);
        _logger.LogInformation("Invoice {InvoiceId} deleted", invoiceId);
    }

    private static InvoiceDto MapToDto(InvoiceEntity invoice)
    {
        return new InvoiceDto
        {
            InvoiceId = invoice.InvoiceId,
            CreatedAt = invoice.CreatedAt,
            CustomerId = invoice.CustomerId,
            StartedAt = invoice.StartedAt,
            FinishedAt = invoice.FinishedAt,
            DepositAmount = invoice.DepositAmount,
            DepositPaidOn = invoice.DepositPaidOn,
            Type = invoice.Type,
            Customer = invoice.Customer == null ? null : new CustomerDto
            {
                CustomerId = invoice.Customer.CustomerId,
                Firstname = invoice.Customer.Firstname,
                Surname = invoice.Customer.Surname,
                Plz = invoice.Customer.Plz,
                City = invoice.Customer.City,
                Address = invoice.Customer.Address,
                Nr = invoice.Customer.Nr,
                Uid = invoice.Customer.Uid
            },
            Positions = invoice.InvoicePositions?.Select(ip => new InvoicePositionDto
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
            }).ToList() ?? new List<InvoicePositionDto>()
        };
    }

    public async Task<int> GetInvoicesCountAsync()
    {
        return await _invoiceDataAccess.GetInvoicesCountAsync();
    }

    public async Task<IEnumerable<InvoiceSummaryDto>> GetAllInvoicesSummaryAsync()
    {
        var invoices = await _invoiceDataAccess.GetAllInvoicesSummaryAsync();
        return invoices.Select(MapToSummaryDto);
    }

    private static InvoiceSummaryDto MapToSummaryDto(InvoiceEntity invoice)
    {
        return new InvoiceSummaryDto
        {
            InvoiceId = invoice.InvoiceId,
            CreatedAt = invoice.CreatedAt,
            CustomerId = invoice.CustomerId,
            StartedAt = invoice.StartedAt,
            FinishedAt = invoice.FinishedAt,
            DepositAmount = invoice.DepositAmount,
            DepositPaidOn = invoice.DepositPaidOn,
            Type = invoice.Type,
            Customer = invoice.Customer == null ? null : new CustomerSummaryDto
            {
                CustomerId = invoice.Customer.CustomerId,
                FullName = $"{invoice.Customer.Firstname} {invoice.Customer.Surname}".Trim()
            },
            PositionCount = invoice.InvoicePositions?.Count ?? 0,
            TotalAmount = invoice.InvoicePositions?.Sum(ip => ip.Amount * (ip.Position?.Price ?? 0)) ?? 0
        };
    }
}
