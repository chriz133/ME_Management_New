using Microsoft.Extensions.Logging;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Transaction;

namespace Server.BusinessLogic.Transaction;

public class TransactionBusinessLogic : ITransactionBusinessLogic
{
    private readonly ITransactionDataAccess _transactionDataAccess;
    private readonly ILogger<TransactionBusinessLogic> _logger;

    public TransactionBusinessLogic(
        ITransactionDataAccess transactionDataAccess,
        ILogger<TransactionBusinessLogic> logger)
    {
        _transactionDataAccess = transactionDataAccess;
        _logger = logger;
    }

    public async Task<IEnumerable<TransactionDto>> GetAllTransactionsAsync()
    {
        var transactions = await _transactionDataAccess.GetAllTransactionsAsync();
        return transactions.Select(MapToDto);
    }

    public async Task<TransactionDto?> GetTransactionByIdAsync(int transactionId)
    {
        var transaction = await _transactionDataAccess.GetTransactionByIdAsync(transactionId);
        return transaction != null ? MapToDto(transaction) : null;
    }

    public async Task<TransactionDto> CreateTransactionAsync(CreateTransactionRequest request)
    {
        var transaction = new TransactionEntity
        {
            Amount = (double)request.Amount,
            Description = request.Description,
            Date = request.Date,
            Type = request.Type,
            Medium = request.Medium
        };

        var createdTransaction = await _transactionDataAccess.CreateTransactionAsync(transaction);
        _logger.LogInformation("Transaction {TransactionId} created", createdTransaction.TransactionId);
        
        return MapToDto(createdTransaction);
    }

    public async Task<TransactionDto> UpdateTransactionAsync(int transactionId, UpdateTransactionRequest request)
    {
        var transaction = await _transactionDataAccess.GetTransactionByIdAsync(transactionId);
        
        if (transaction == null)
        {
            throw new ArgumentException($"Transaction with ID {transactionId} not found");
        }

        transaction.Amount = (double)request.Amount;
        transaction.Description = request.Description;
        transaction.Date = request.Date;
        transaction.Type = request.Type;
        transaction.Medium = request.Medium;

        await _transactionDataAccess.UpdateTransactionAsync(transaction);
        _logger.LogInformation("Transaction {TransactionId} updated", transactionId);
        
        return MapToDto(transaction);
    }

    public async Task DeleteTransactionAsync(int transactionId)
    {
        var transaction = await _transactionDataAccess.GetTransactionByIdAsync(transactionId);
        
        if (transaction == null)
        {
            throw new ArgumentException($"Transaction with ID {transactionId} not found");
        }

        await _transactionDataAccess.DeleteTransactionAsync(transaction);
        _logger.LogInformation("Transaction {TransactionId} deleted", transactionId);
    }

    private static TransactionDto MapToDto(TransactionEntity transaction)
    {
        return new TransactionDto
        {
            TransactionId = transaction.TransactionId,
            Amount = transaction.Amount,
            Description = transaction.Description,
            Date = transaction.Date,
            Type = transaction.Type,
            Medium = transaction.Medium
        };
    }
}
