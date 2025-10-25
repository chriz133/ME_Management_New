using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;

namespace Server.BusinessLogic.Services;

public interface IContractService
{
    Task<ContractDto> CreateContractAsync(CreateContractRequest request);
}
