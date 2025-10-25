using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Server.Api.Controllers;

/// <summary>
/// Controller for system information operations.
/// Handles system status and database connection information.
/// </summary>
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SystemController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SystemController> _logger;

    public SystemController(IConfiguration configuration, ILogger<SystemController> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Get database connection information (database name and server).
    /// </summary>
    [HttpGet("database-info")]
    [ProducesResponseType(typeof(DatabaseInfoResponse), StatusCodes.Status200OK)]
    public ActionResult<DatabaseInfoResponse> GetDatabaseInfo()
    {
        try
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            
            if (string.IsNullOrEmpty(connectionString))
            {
                _logger.LogWarning("Connection string not found");
                return Ok(new DatabaseInfoResponse
                {
                    DatabaseName = "Unknown",
                    ServerAddress = "Unknown"
                });
            }

            // Parse the connection string to extract database name and server
            var databaseName = ExtractFromConnectionString(connectionString, "Database");
            var serverAddress = ExtractFromConnectionString(connectionString, "Server");

            _logger.LogInformation("Retrieved database info - Database: {DatabaseName}, Server: {ServerAddress}", 
                databaseName, serverAddress);

            return Ok(new DatabaseInfoResponse
            {
                DatabaseName = databaseName ?? "Unknown",
                ServerAddress = serverAddress ?? "Unknown"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving database information");
            return StatusCode(500, new { message = "Error retrieving database information" });
        }
    }

    /// <summary>
    /// Extract a value from a connection string by key.
    /// </summary>
    private string? ExtractFromConnectionString(string connectionString, string key)
    {
        var parts = connectionString.Split(';');
        foreach (var part in parts)
        {
            var keyValue = part.Split('=');
            if (keyValue.Length == 2 && keyValue[0].Trim().Equals(key, StringComparison.OrdinalIgnoreCase))
            {
                return keyValue[1].Trim();
            }
        }
        return null;
    }
}

/// <summary>
/// Response model for database information.
/// </summary>
public class DatabaseInfoResponse
{
    public string DatabaseName { get; set; } = string.Empty;
    public string ServerAddress { get; set; } = string.Empty;
}
