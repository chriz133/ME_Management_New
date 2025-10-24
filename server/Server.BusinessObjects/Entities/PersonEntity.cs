using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities;

/// <summary>
/// Entity mapping to firmaDB 'person' table
/// Represents a person/contact in the ME Management system
/// Column names preserved from existing database schema
/// </summary>
[Table("person")]
public class PersonEntity
{
    [Key]
    [Column("PERSON_ID")]
    public int PersonId { get; set; }

    [Column("FIRST_NAME")]
    [MaxLength(45)]
    public string? FirstName { get; set; }

    [Column("LAST_NAME")]
    [MaxLength(45)]
    public string? LastName { get; set; }

    [Column("EMAIL")]
    [MaxLength(45)]
    public string? Email { get; set; }

    [Column("PHONE")]
    [MaxLength(45)]
    public string? Phone { get; set; }

    [Column("CUSTOMER_ID")]
    public int? CustomerId { get; set; }

    [Column("ADDRESS_ID")]
    public int? AddressId { get; set; }

    // Navigation properties
    [ForeignKey(nameof(CustomerId))]
    public virtual CustomerEntity? Customer { get; set; }

    [ForeignKey(nameof(AddressId))]
    public virtual Address? Address { get; set; }

    public virtual ICollection<ContractEntity>? Contracts { get; set; }
}
