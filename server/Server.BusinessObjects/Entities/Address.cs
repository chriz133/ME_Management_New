using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.BusinessObjects.Entities
{
    /// <summary>
    /// Address entity - maps to existing 'address' table in firmaDB
    /// </summary>
    [Table("address")]
    public class Address
    {
        [Key]
        [Column("ADDRESS_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AddressId { get; set; }

        [Column("ZIP")]
        public int? Zip { get; set; }

        [Column("CITY")]
        [MaxLength(45)]
        public string? City { get; set; }

        [Column("STREET")]
        [MaxLength(45)]
        public string? Street { get; set; }

        [Column("NR")]
        [MaxLength(45)]
        public string? Nr { get; set; }
    }
}
