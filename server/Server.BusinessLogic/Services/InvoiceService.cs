using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Repositories;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service implementation for invoice business logic.
/// Handles invoice CRUD operations, calculations, and PDF generation coordination.
/// </summary>
public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository;
    private readonly IPdfService _pdfService;

    public InvoiceService(IInvoiceRepository invoiceRepository, IPdfService pdfService)
    {
        _invoiceRepository = invoiceRepository;
        _pdfService = pdfService;
    }

    public async Task<IEnumerable<InvoiceDto>> GetAllAsync()
    {
        var invoices = await _invoiceRepository.GetAllAsync();
        return invoices.Select(MapToDto);
    }

    public async Task<InvoiceDto?> GetByIdAsync(int id)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id);
        return invoice == null ? null : MapToDto(invoice);
    }

    public async Task<IEnumerable<InvoiceDto>> GetByCustomerIdAsync(int customerId)
    {
        var invoices = await _invoiceRepository.GetByCustomerIdAsync(customerId);
        return invoices.Select(MapToDto);
    }

    public async Task<InvoiceDto> CreateAsync(InvoiceCreateUpdateDto dto)
    {
        var invoice = new Invoice
        {
            CustomerId = dto.CustomerId,
            ContractId = dto.ContractId,
            InvoiceNumber = dto.InvoiceNumber,
            InvoiceDate = dto.InvoiceDate,
            DueDate = dto.DueDate,
            Status = Enum.Parse<InvoiceStatus>(dto.Status),
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            LineItems = dto.LineItems.Select((li, index) => new InvoiceLineItem
            {
                PositionId = li.PositionId,
                LineNumber = li.LineNumber,
                Description = li.Description,
                Quantity = li.Quantity,
                Unit = li.Unit,
                UnitPrice = li.UnitPrice,
                TaxRate = li.TaxRate
            }).ToList()
        };

        var created = await _invoiceRepository.AddAsync(invoice);
        return MapToDto(created);
    }

    public async Task<InvoiceDto?> UpdateAsync(int id, InvoiceCreateUpdateDto dto)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id);
        if (invoice == null)
        {
            return null;
        }

        invoice.CustomerId = dto.CustomerId;
        invoice.ContractId = dto.ContractId;
        invoice.InvoiceNumber = dto.InvoiceNumber;
        invoice.InvoiceDate = dto.InvoiceDate;
        invoice.DueDate = dto.DueDate;
        invoice.Status = Enum.Parse<InvoiceStatus>(dto.Status);
        invoice.Notes = dto.Notes;
        invoice.UpdatedAt = DateTime.UtcNow;

        // Update line items (simple approach: clear and recreate)
        invoice.LineItems.Clear();
        invoice.LineItems = dto.LineItems.Select(li => new InvoiceLineItem
        {
            InvoiceId = id,
            PositionId = li.PositionId,
            LineNumber = li.LineNumber,
            Description = li.Description,
            Quantity = li.Quantity,
            Unit = li.Unit,
            UnitPrice = li.UnitPrice,
            TaxRate = li.TaxRate
        }).ToList();

        var updated = await _invoiceRepository.UpdateAsync(invoice);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var exists = await _invoiceRepository.ExistsAsync(id);
        if (!exists)
        {
            return false;
        }

        await _invoiceRepository.DeleteAsync(id);
        return true;
    }

    public async Task<byte[]?> GeneratePdfAsync(int id)
    {
        var invoice = await _invoiceRepository.GetByIdWithDetailsAsync(id);
        if (invoice == null)
        {
            return null;
        }

        return _pdfService.GenerateInvoicePdf(invoice);
    }

    private static InvoiceDto MapToDto(Invoice invoice)
    {
        var lineItemsDto = invoice.LineItems
            .OrderBy(li => li.LineNumber)
            .Select(li => new InvoiceLineItemDto
            {
                Id = li.Id,
                InvoiceId = li.InvoiceId,
                PositionId = li.PositionId,
                LineNumber = li.LineNumber,
                Description = li.Description,
                Quantity = li.Quantity,
                Unit = li.Unit,
                UnitPrice = li.UnitPrice,
                TaxRate = li.TaxRate
            }).ToList();

        var netTotal = lineItemsDto.Sum(li => li.LineTotal);
        var taxTotal = lineItemsDto.Sum(li => li.LineTax);

        return new InvoiceDto
        {
            Id = invoice.Id,
            CustomerId = invoice.CustomerId,
            CustomerName = invoice.Customer?.Name ?? string.Empty,
            ContractId = invoice.ContractId,
            InvoiceNumber = invoice.InvoiceNumber,
            InvoiceDate = invoice.InvoiceDate,
            DueDate = invoice.DueDate,
            Status = invoice.Status.ToString(),
            Notes = invoice.Notes,
            LineItems = lineItemsDto,
            NetTotal = netTotal,
            TaxTotal = taxTotal,
            GrossTotal = netTotal + taxTotal,
            CreatedAt = invoice.CreatedAt,
            UpdatedAt = invoice.UpdatedAt
        };
    }
}
