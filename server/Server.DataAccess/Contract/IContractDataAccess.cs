using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Contract;

public interface IContractDataAccess
{
    Task<IEnumerable<ContractEntity>> GetAllContractsAsync();
    Task<ContractEntity?> GetContractByIdAsync(int contractId);
    Task<IEnumerable<ContractEntity>> GetContractsByCustomerIdAsync(int customerId);
    Task<ContractEntity> CreateContractAsync(ContractEntity contract);
    Task<ContractEntity?> GetContractWithPositionsAsync(int contractId);
    Task UpdateContractAsync(ContractEntity contract);
    Task DeleteContractAsync(ContractEntity contract);
    Task SaveChangesAsync();
}
