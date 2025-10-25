using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess.Position;

public class PositionDataAccess : IPositionDataAccess
{
    private readonly ApplicationDbContext _context;

    public PositionDataAccess(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PositionEntity>> GetAllPositionsAsync()
    {
        return await _context.PositionsDb.ToListAsync();
    }

    public async Task<PositionEntity?> GetPositionByIdAsync(int positionId)
    {
        return await _context.PositionsDb.FindAsync(positionId);
    }

    public async Task<PositionEntity> CreatePositionAsync(PositionEntity position)
    {
        _context.PositionsDb.Add(position);
        await _context.SaveChangesAsync();
        return position;
    }
}
