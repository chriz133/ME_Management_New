using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Transaction;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionBusinessLogic _transactionBusinessLogic;
    private readonly ILogger<TransactionsController> _logger;

    public TransactionsController(ITransactionBusinessLogic transactionBusinessLogic, ILogger<TransactionsController> logger)
    {
        _transactionBusinessLogic = transactionBusinessLogic;
        _logger = logger;
    }

    /// <summary>
    /// Get all transactions
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetTransactions()
    {
        try
        {
            var transactions = await _transactionBusinessLogic.GetAllTransactionsAsync();
            return Ok(transactions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching transactions");
            return StatusCode(500, new { message = "Error fetching transactions", error = ex.Message });
        }
    }

    /// <summary>
    /// Get transaction by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionDto>> GetTransaction(int id)
    {
        try
        {
            var transaction = await _transactionBusinessLogic.GetTransactionByIdAsync(id);
                
            if (transaction == null)
            {
                return NotFound(new { message = $"Transaction with ID {id} not found" });
            }
            
            return Ok(transaction);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching transaction {TransactionId}", id);
            return StatusCode(500, new { message = "Error fetching transaction", error = ex.Message });
        }
    }

    /// <summary>
    /// Create a new transaction (requires Admin or User role)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<TransactionDto>> CreateTransaction([FromBody] CreateTransactionRequest request)
    {
        try
        {
            var transactionDto = await _transactionBusinessLogic.CreateTransactionAsync(request);
            return CreatedAtAction(nameof(GetTransaction), new { id = transactionDto.TransactionId }, transactionDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating transaction");
            return StatusCode(500, new { message = "Error creating transaction", error = ex.Message });
        }
    }
}
