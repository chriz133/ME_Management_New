using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PositionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PositionsController> _logger;

    public PositionsController(ApplicationDbContext context, ILogger<PositionsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Get all positions
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PositionDto>>> GetPositions()
    {
        try
        {
            var positions = await _context.PositionsDb
                .Select(p => new PositionDto
                {
                    PositionId = p.PositionId,
                    Text = p.Text,
                    Price = p.Price,
                    Unit = p.Unit
                })
                .ToListAsync();
                
            return Ok(positions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching positions");
            return StatusCode(500, new { message = "Error fetching positions", error = ex.Message });
        }
    }

    /// <summary>
    /// Get position by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PositionDto>> GetPosition(int id)
    {
        try
        {
            var position = await _context.PositionsDb
                .Where(p => p.PositionId == id)
                .Select(p => new PositionDto
                {
                    PositionId = p.PositionId,
                    Text = p.Text,
                    Price = p.Price,
                    Unit = p.Unit
                })
                .FirstOrDefaultAsync();
                
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

    /// <summary>
    /// Create a new position (requires Admin or User role)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<PositionDto>> CreatePosition([FromBody] CreatePositionRequest request)
    {
        try
        {
            var position = new PositionEntity
            {
                Text = request.Text,
                Price = (double)request.Price,
                Unit = request.Unit
            };

            _context.PositionsDb.Add(position);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Position {PositionId} created", position.PositionId);

            var positionDto = new PositionDto
            {
                PositionId = position.PositionId,
                Text = position.Text,
                Price = position.Price,
                Unit = position.Unit
            };

            return CreatedAtAction(nameof(GetPosition), new { id = position.PositionId }, positionDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating position");
            return StatusCode(500, new { message = "Error creating position", error = ex.Message });
        }
    }
}
