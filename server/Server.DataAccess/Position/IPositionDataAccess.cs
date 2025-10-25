using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Position;

public interface IPositionDataAccess
{
    Task<IEnumerable<PositionEntity>> GetAllPositionsAsync();
    Task<PositionEntity?> GetPositionByIdAsync(int positionId);
    Task<PositionEntity> CreatePositionAsync(PositionEntity position);
}
