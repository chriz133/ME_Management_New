using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Repositories;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service implementation for offer business logic.
/// Handles offer CRUD operations, calculations, and PDF generation coordination.
/// </summary>
public class OfferService : IOfferService
{
    private readonly IOfferRepository _offerRepository;
    private readonly IPdfService _pdfService;

    public OfferService(IOfferRepository offerRepository, IPdfService pdfService)
    {
        _offerRepository = offerRepository;
        _pdfService = pdfService;
    }

    public async Task<IEnumerable<OfferDto>> GetAllAsync()
    {
        var offers = await _offerRepository.GetAllAsync();
        return offers.Select(MapToDto);
    }

    public async Task<OfferDto?> GetByIdAsync(int id)
    {
        var offer = await _offerRepository.GetByIdAsync(id);
        return offer == null ? null : MapToDto(offer);
    }

    public async Task<IEnumerable<OfferDto>> GetByCustomerIdAsync(int customerId)
    {
        var offers = await _offerRepository.GetByCustomerIdAsync(customerId);
        return offers.Select(MapToDto);
    }

    public async Task<OfferDto> CreateAsync(OfferCreateUpdateDto dto)
    {
        var offer = new Offer
        {
            CustomerId = dto.CustomerId,
            OfferNumber = dto.OfferNumber,
            Title = dto.Title,
            OfferDate = dto.OfferDate,
            ValidUntil = dto.ValidUntil,
            Status = Enum.Parse<OfferStatus>(dto.Status),
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow,
            LineItems = dto.LineItems.Select(li => new OfferLineItem
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

        var created = await _offerRepository.AddAsync(offer);
        return MapToDto(created);
    }

    public async Task<OfferDto?> UpdateAsync(int id, OfferCreateUpdateDto dto)
    {
        var offer = await _offerRepository.GetByIdAsync(id);
        if (offer == null)
        {
            return null;
        }

        offer.CustomerId = dto.CustomerId;
        offer.OfferNumber = dto.OfferNumber;
        offer.Title = dto.Title;
        offer.OfferDate = dto.OfferDate;
        offer.ValidUntil = dto.ValidUntil;
        offer.Status = Enum.Parse<OfferStatus>(dto.Status);
        offer.Notes = dto.Notes;
        offer.UpdatedAt = DateTime.UtcNow;

        // Update line items (simple approach: clear and recreate)
        offer.LineItems.Clear();
        offer.LineItems = dto.LineItems.Select(li => new OfferLineItem
        {
            OfferId = id,
            PositionId = li.PositionId,
            LineNumber = li.LineNumber,
            Description = li.Description,
            Quantity = li.Quantity,
            Unit = li.Unit,
            UnitPrice = li.UnitPrice,
            TaxRate = li.TaxRate
        }).ToList();

        var updated = await _offerRepository.UpdateAsync(offer);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var exists = await _offerRepository.ExistsAsync(id);
        if (!exists)
        {
            return false;
        }

        await _offerRepository.DeleteAsync(id);
        return true;
    }

    public async Task<byte[]?> GeneratePdfAsync(int id)
    {
        var offer = await _offerRepository.GetByIdWithDetailsAsync(id);
        if (offer == null)
        {
            return null;
        }

        return _pdfService.GenerateOfferPdf(offer);
    }

    private static OfferDto MapToDto(Offer offer)
    {
        var lineItemsDto = offer.LineItems
            .OrderBy(li => li.LineNumber)
            .Select(li => new OfferLineItemDto
            {
                Id = li.Id,
                OfferId = li.OfferId,
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

        return new OfferDto
        {
            Id = offer.Id,
            CustomerId = offer.CustomerId,
            CustomerName = offer.Customer?.Name ?? string.Empty,
            OfferNumber = offer.OfferNumber,
            Title = offer.Title,
            OfferDate = offer.OfferDate,
            ValidUntil = offer.ValidUntil,
            Status = offer.Status.ToString(),
            Notes = offer.Notes,
            LineItems = lineItemsDto,
            NetTotal = netTotal,
            TaxTotal = taxTotal,
            GrossTotal = netTotal + taxTotal,
            CreatedAt = offer.CreatedAt,
            UpdatedAt = offer.UpdatedAt
        };
    }
}
