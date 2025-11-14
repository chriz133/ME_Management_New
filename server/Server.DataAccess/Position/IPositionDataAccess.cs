using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Position;

public interface IPositionDataAccess
{
    Task<IEnumerable<PositionEntity>> GetAllPositionsAsync();
    Task<PositionEntity?> GetPositionByIdAsync(int positionId);
    Task<PositionEntity> CreatePositionAsync(PositionEntity position);
    Task<PositionEntity> UpdatePositionAsync(PositionEntity position);
    Task DeletePositionAsync(int positionId);
    Task<bool> PositionExistsAsync(int positionId);
}
