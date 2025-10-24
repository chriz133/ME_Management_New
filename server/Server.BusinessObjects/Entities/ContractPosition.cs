using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Contract Position entity - maps to 'contract_position' table in firmaDB
/// Links a Position to a Contract with specific amount
/// </summary>
[Table("contract_position")]
public class ContractPosition
{
    [Key]
    [Column("contractPositionId")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ContractPositionId { get; set; }

    [Column("amount")]
    public double Amount { get; set; }

    [Column("contractId")]
    public int ContractId { get; set; }

    [Column("positionId")]
    public int PositionId { get; set; }

    // Navigation properties
    [ForeignKey(nameof(ContractId))]
    public virtual ContractEntity? Contract { get; set; }

    [ForeignKey(nameof(PositionId))]
    public virtual PositionEntity? Position { get; set; }
}
