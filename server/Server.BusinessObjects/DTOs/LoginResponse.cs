namespace Server.BusinessObjects.DTOs;

/// <summary>
/// Response model for successful login
/// </summary>
public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
}
