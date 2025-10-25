using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Transaction;

public interface ITransactionBusinessLogic
{
    Task<IEnumerable<TransactionDto>> GetAllTransactionsAsync();
    Task<TransactionDto?> GetTransactionByIdAsync(int transactionId);
    Task<TransactionDto> CreateTransactionAsync(CreateTransactionRequest request);
}
