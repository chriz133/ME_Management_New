using Server.BusinessObjects.DTOs;

namespace Server.BusinessLogic.Services;

/// <summary>
/// Service interface for authentication and JWT token generation
/// </summary>
public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<bool> ValidateTokenAsync(string token);
}
