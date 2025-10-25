using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.BusinessLogic.Position;
using Server.BusinessObjects.DTOs;

namespace Server.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PositionsController : ControllerBase
{
    private readonly IPositionBusinessLogic _positionBusinessLogic;
    private readonly ILogger<PositionsController> _logger;

    public PositionsController(IPositionBusinessLogic positionBusinessLogic, ILogger<PositionsController> logger)
    {
        _positionBusinessLogic = positionBusinessLogic;
        _logger = logger;
    }

    /// <summary>
    /// Get all positions (for selection in contracts/invoices)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PositionDto>>> GetPositions()
    {
        try
        {
            var positions = await _positionBusinessLogic.GetAllPositionsAsync();
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
            var position = await _positionBusinessLogic.GetPositionByIdAsync(id);
                
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
            var createdPosition = await _positionBusinessLogic.CreatePositionAsync(request);
            return CreatedAtAction(nameof(GetPosition), new { id = createdPosition.PositionId }, createdPosition);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating position");
            return StatusCode(500, new { message = "Error creating position", error = ex.Message });
        }
    }

    /// <summary>
    /// Update an existing position (requires Admin or User role)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,User")]
    public async Task<ActionResult<PositionDto>> UpdatePosition(int id, [FromBody] UpdatePositionRequest request)
    {
        try
        {
            var positionDto = await _positionBusinessLogic.UpdatePositionAsync(id, request);
            return Ok(positionDto);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Position {PositionId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating position {PositionId}", id);
            return StatusCode(500, new { message = "Error updating position", error = ex.Message });
        }
    }

    /// <summary>
    /// Delete position (requires Admin role only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeletePosition(int id)
    {
        try
        {
            await _positionBusinessLogic.DeletePositionAsync(id);
            _logger.LogInformation("Position {PositionId} deleted by admin", id);
            return Ok(new { message = "Position deleted successfully" });
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Position {PositionId} not found", id);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting position {PositionId}", id);
            return StatusCode(500, new { message = "Error deleting position", error = ex.Message });
        }
    }
}
