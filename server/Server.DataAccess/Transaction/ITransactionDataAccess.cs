using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Transaction;

public interface ITransactionDataAccess
{
    Task<IEnumerable<TransactionEntity>> GetAllTransactionsAsync();
    Task<TransactionEntity?> GetTransactionByIdAsync(int transactionId);
    Task<TransactionEntity> CreateTransactionAsync(TransactionEntity transaction);
    Task UpdateTransactionAsync(TransactionEntity transaction);
    Task DeleteTransactionAsync(TransactionEntity transaction);
}
