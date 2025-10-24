using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FirmaDBTransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FirmaDBTransactionsController> _logger;

    public FirmaDBTransactionsController(ApplicationDbContext context, ILogger<FirmaDBTransactionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all transactions from firmaDB
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionEntity>>> GetTransactions()
    {
        try
        {
            var transactions = await _context.Transactions
                .OrderByDescending(t => t.Date)
                .ToListAsync();
            return Ok(transactions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching transactions from firmaDB");
            return StatusCode(500, new { message = "Error fetching transactions", error = ex.Message });
        }
    }

    /// <summary>
    /// Get transaction by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionEntity>> GetTransaction(int id)
    {
        try
        {
            var transaction = await _context.Transactions.FindAsync(id);
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
}
