using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Position;

public interface IPositionBusinessLogic
{
    Task<IEnumerable<PositionDto>> GetAllPositionsAsync();
    Task<PositionDto?> GetPositionByIdAsync(int positionId);
    Task<PositionDto> CreatePositionAsync(CreatePositionRequest request);
    Task<PositionDto> UpdatePositionAsync(int positionId, UpdatePositionRequest request);
    Task DeletePositionAsync(int positionId);
}
