using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Entity mapping to firmaDB 'position' table
/// Represents a service position/offering in the ME Management system
/// Column names preserved from existing database schema
/// </summary>
[Table("position")]
public class PositionEntity
{
    [Key]
    [Column("POSITION_ID")]
    public int PositionId { get; set; }

    [Column("NAME")]
    [MaxLength(100)]
    public string? Name { get; set; }

    [Column("DESCRIPTION")]
    [MaxLength(500)]
    public string? Description { get; set; }

    [Column("PRICE", TypeName = "decimal(10,2)")]
    public decimal? Price { get; set; }

    [Column("UNIT")]
    [MaxLength(20)]
    public string? Unit { get; set; }

    // Navigation properties
    public virtual ICollection<ContractEntity>? Contracts { get; set; }
    public virtual ICollection<ContractPosition>? ContractPositions { get; set; }
}
