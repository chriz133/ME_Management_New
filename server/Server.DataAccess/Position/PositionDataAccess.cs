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

    public async Task<PositionEntity> UpdatePositionAsync(PositionEntity position)
    {
        _context.PositionsDb.Update(position);
        await _context.SaveChangesAsync();
        return position;
    }

    public async Task DeletePositionAsync(int positionId)
    {
        var position = await _context.PositionsDb.FindAsync(positionId);
        if (position != null)
        {
            _context.PositionsDb.Remove(position);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> PositionExistsAsync(int positionId)
    {
        return await _context.PositionsDb.AnyAsync(p => p.PositionId == positionId);
    }
}
