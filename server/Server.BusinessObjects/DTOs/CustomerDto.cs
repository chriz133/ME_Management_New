namespace Server.BusinessObjects.DTOs;

/// <summary>
/// DTO for customer information from firmaDB
/// </summary>
public class CustomerDto
{
    public int CustomerId { get; set; }
    public string? Firstname { get; set; }
    public string? Surname { get; set; }
    public string FullName => $"{Firstname} {Surname}".Trim();
    public int? Plz { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public int? Nr { get; set; }
    public string? Uid { get; set; }
}
