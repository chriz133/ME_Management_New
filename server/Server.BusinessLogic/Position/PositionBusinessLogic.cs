using Microsoft.Extensions.Logging;
using Server.BusinessObjects.DTOs;
using Server.BusinessObjects.Entities;
using Server.DataAccess.Position;

namespace Server.BusinessLogic.Position;

public class PositionBusinessLogic : IPositionBusinessLogic
{
    private readonly IPositionDataAccess _positionDataAccess;
    private readonly ILogger<PositionBusinessLogic> _logger;

    public PositionBusinessLogic(
        IPositionDataAccess positionDataAccess,
        ILogger<PositionBusinessLogic> logger)
    {
        _positionDataAccess = positionDataAccess;
        _logger = logger;
    }

    public async Task<IEnumerable<PositionDto>> GetAllPositionsAsync()
    {
        var positions = await _positionDataAccess.GetAllPositionsAsync();
        return positions.Select(MapToDto);
    }

    public async Task<PositionDto?> GetPositionByIdAsync(int positionId)
    {
        var position = await _positionDataAccess.GetPositionByIdAsync(positionId);
        return position != null ? MapToDto(position) : null;
    }

    public async Task<PositionDto> CreatePositionAsync(CreatePositionRequest request)
    {
        var position = new PositionEntity
        {
            Text = request.Text,
            Price = request.Price,
            Unit = request.Unit
        };

        var createdPosition = await _positionDataAccess.CreatePositionAsync(position);
        _logger.LogInformation("Position {PositionId} created", createdPosition.PositionId);
        
        return MapToDto(createdPosition);
    }

    private static PositionDto MapToDto(PositionEntity position)
    {
        return new PositionDto
        {
            PositionId = position.PositionId,
            Text = position.Text,
            Price = position.Price,
            Unit = position.Unit
        };
    }
}
