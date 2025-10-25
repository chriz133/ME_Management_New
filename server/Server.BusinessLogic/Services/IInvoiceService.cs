using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Services;

public interface IInvoiceService
{
    Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceRequest request);
}
