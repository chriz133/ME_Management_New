using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FirmaDBPositionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FirmaDBPositionsController> _logger;

    public FirmaDBPositionsController(ApplicationDbContext context, ILogger<FirmaDBPositionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all positions from firmaDB
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PositionEntity>>> GetPositions()
    {
        try
        {
            var positions = await _context.PositionsDb.ToListAsync();
            return Ok(positions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching positions from firmaDB");
            return StatusCode(500, new { message = "Error fetching positions", error = ex.Message });
        }
    }

    /// <summary>
    /// Get position by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PositionEntity>> GetPosition(int id)
    {
        try
        {
            var position = await _context.PositionsDb.FindAsync(id);
            if (position == null)
            {
                return NotFound(new { message = $"Position with ID {id} not found" });
            }
            return Ok(position);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching position {PositionId}", id);
            return StatusCode(500, new { message = "Error fetching position", error = ex.Message });
        }
    }
}
