namespace Server.BusinessObjects.Entities;

/// <summary>
/// Represents a user in the system with authentication credentials.
/// Used for JWT-based authentication and authorization.
/// </summary>
public class User
{
    public int Id { get; set; }
    
    /// <summary>
    /// Username for login
    /// </summary>
    public string Username { get; set; } = string.Empty;
    
    /// <summary>
    /// Hashed password (never store plain text passwords)
    /// </summary>
    public string PasswordHash { get; set; } = string.Empty;
    
    /// <summary>
    /// Display name for UI purposes
    /// </summary>
    public string DisplayName { get; set; } = string.Empty;
    
    /// <summary>
    /// Email address for notifications
    /// </summary>
    public string Email { get; set; } = string.Empty;
    
    /// <summary>
    /// User role: "Admin" or "User"
    /// Admin can view, edit, and delete everything
    /// User can view and edit but cannot delete
    /// </summary>
    public string Role { get; set; } = "User";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastLoginAt { get; set; }
}
