using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Contract;

public class ContractDataAccess : IContractDataAccess
{
    private readonly ApplicationDbContext _context;

    public ContractDataAccess(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ContractEntity>> GetAllContractsAsync()
    {
        return await _context.ContractsDb
            .Include(c => c.Customer)
            .Include(c => c.ContractPositions)
                .ThenInclude(cp => cp.Position)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<ContractEntity?> GetContractByIdAsync(int contractId)
    {
        return await _context.ContractsDb
            .Include(c => c.Customer)
            .Include(c => c.ContractPositions)
                .ThenInclude(cp => cp.Position)
            .FirstOrDefaultAsync(c => c.ContractId == contractId);
    }

    public async Task<IEnumerable<ContractEntity>> GetContractsByCustomerIdAsync(int customerId)
    {
        return await _context.ContractsDb
            .Where(c => c.CustomerId == customerId)
            .Include(c => c.ContractPositions)
                .ThenInclude(cp => cp.Position)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<ContractEntity> CreateContractAsync(ContractEntity contract)
    {
        _context.ContractsDb.Add(contract);
        await _context.SaveChangesAsync();
        return contract;
    }

    public async Task<ContractEntity?> GetContractWithPositionsAsync(int contractId)
    {
        return await _context.ContractsDb
            .Include(c => c.ContractPositions)
                .ThenInclude(cp => cp.Position)
            .FirstOrDefaultAsync(c => c.ContractId == contractId);
    }

    public async Task UpdateContractAsync(ContractEntity contract)
    {
        _context.ContractsDb.Update(contract);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteContractAsync(ContractEntity contract)
    {
        // Remove contract positions first if they exist
        if (contract.ContractPositions != null)
        {
            _context.ContractPositions.RemoveRange(contract.ContractPositions);
        }
        
        _context.ContractsDb.Remove(contract);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> CustomerExistsAsync(int customerId)
    {
        return await _context.CustomersDb.AnyAsync(c => c.CustomerId == customerId);
    }

    public async Task<PositionEntity?> GetPositionByIdAsync(int positionId)
    {
        return await _context.PositionsDb.FindAsync(positionId);
    }

    public async Task<PositionEntity> CreatePositionAsync(PositionEntity position)
    {
        _context.PositionsDb.Add(position);
        await _context.SaveChangesAsync();
        return position;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetContractsCountAsync()
    {
        return await _context.ContractsDb.CountAsync();
    }

    public async Task<IEnumerable<ContractEntity>> GetAllContractsSummaryAsync()
    {
        return await _context.ContractsDb
            .Include(c => c.Customer)
            .Include(c => c.ContractPositions)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }
}
