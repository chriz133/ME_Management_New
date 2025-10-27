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
    Task<bool> CustomerExistsAsync(int customerId);
    Task<PositionEntity?> GetPositionByIdAsync(int positionId);
    Task<PositionEntity> CreatePositionAsync(PositionEntity position);
    Task SaveChangesAsync();
    Task<int> GetContractsCountAsync();
    Task<IEnumerable<ContractEntity>> GetAllContractsSummaryAsync();
}
