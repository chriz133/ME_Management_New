using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Transaction;

public class TransactionDataAccess : ITransactionDataAccess
{
    private readonly ApplicationDbContext _context;

    public TransactionDataAccess(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TransactionEntity>> GetAllTransactionsAsync()
    {
        return await _context.Transactions
            .OrderByDescending(t => t.Date)
            .ToListAsync();
    }

    public async Task<TransactionEntity?> GetTransactionByIdAsync(int transactionId)
    {
        return await _context.Transactions.FindAsync(transactionId);
    }

    public async Task<TransactionEntity> CreateTransactionAsync(TransactionEntity transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task UpdateTransactionAsync(TransactionEntity transaction)
    {
        _context.Transactions.Update(transaction);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTransactionAsync(TransactionEntity transaction)
    {
        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
    }
}
