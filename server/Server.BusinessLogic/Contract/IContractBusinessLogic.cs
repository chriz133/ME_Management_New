using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Contract;

public interface IContractBusinessLogic
{
    Task<IEnumerable<ContractDto>> GetAllContractsAsync();
    Task<ContractDto?> GetContractByIdAsync(int contractId);
    Task<ContractDto> CreateContractAsync(CreateContractRequest request);
    Task UpdateContractAsync(int contractId, bool accepted);
    Task DeleteContractAsync(int contractId);
    Task<CreateInvoiceRequest> GetContractForInvoiceConversionAsync(int contractId);
}
