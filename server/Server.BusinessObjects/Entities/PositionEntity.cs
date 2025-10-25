using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Position entity - maps to 'position' table in firmaDB
/// Represents a service or product position
/// </summary>
[Table("position")]
public class PositionEntity
{
    [Key]
    [Column("positionId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PositionId { get; set; }

    [Column("text")]
    [MaxLength(255)]
    public string? Text { get; set; }

    [Column("price")]
    public double Price { get; set; }

    [Column("unit")]
    [MaxLength(45)]
    public string? Unit { get; set; }

    // Navigation properties
    public virtual ICollection<ContractPosition>? ContractPositions { get; set; }
    public virtual ICollection<InvoicePosition>? InvoicePositions { get; set; }
}
