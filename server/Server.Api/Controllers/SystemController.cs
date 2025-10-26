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

            _logger.LogDebug("Retrieved database info successfully");

            return Ok(new DatabaseInfoResponse
            {
                DatabaseName = databaseName ?? "Unknown",
                ServerAddress = serverAddress ?? "Unknown"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving database information");
            return Ok(new DatabaseInfoResponse
            {
                DatabaseName = "Unknown",
                ServerAddress = "Unknown"
            });
        }
    }

    /// <summary>
    /// Get PDF save path settings.
    /// </summary>
    [HttpGet("pdf-settings")]
    [ProducesResponseType(typeof(PdfSettingsResponse), StatusCodes.Status200OK)]
    public ActionResult<PdfSettingsResponse> GetPdfSettings()
    {
        try
        {
            var invoicePath = _configuration["PdfSettings:InvoiceSavePath"] ?? "C:\\PDFs\\Invoices";
            var contractPath = _configuration["PdfSettings:ContractSavePath"] ?? "C:\\PDFs\\Contracts";

            _logger.LogDebug("Retrieved PDF settings successfully");

            return Ok(new PdfSettingsResponse
            {
                InvoiceSavePath = invoicePath,
                ContractSavePath = contractPath
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving PDF settings");
            return Ok(new PdfSettingsResponse
            {
                InvoiceSavePath = "C:\\PDFs\\Invoices",
                ContractSavePath = "C:\\PDFs\\Contracts"
            });
        }
    }

    /// <summary>
    /// Extract a value from a connection string by key.
    /// Handles values that may contain '=' characters.
    /// </summary>
    private string? ExtractFromConnectionString(string connectionString, string key)
    {
        var parts = connectionString.Split(';');
        foreach (var part in parts)
        {
            var firstEquals = part.IndexOf('=');
            if (firstEquals > 0)
            {
                var partKey = part.Substring(0, firstEquals).Trim();
                if (partKey.Equals(key, StringComparison.OrdinalIgnoreCase))
                {
                    return part.Substring(firstEquals + 1).Trim();
                }
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

/// <summary>
/// Response model for PDF settings.
/// </summary>
public class PdfSettingsResponse
{
    public string InvoiceSavePath { get; set; } = string.Empty;
    public string ContractSavePath { get; set; } = string.Empty;
}
