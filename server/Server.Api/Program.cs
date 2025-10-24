using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Server.BusinessLogic.Services;
using Server.BusinessObjects.Entities;
using Server.DataAccess;
using Server.DataAccess.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Configure database context - Using MySQL database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? throw new InvalidOperationException("MySQL connection string 'DefaultConnection' not found.");
    
    var serverVersion = ServerVersion.AutoDetect(connectionString);
    options.UseMySql(connectionString, serverVersion);
    Console.WriteLine("Using MySQL database");
});

// Configure repositories
builder.Services.AddScoped<IRepository<Customer>, Repository<Customer>>();
builder.Services.AddScoped<IRepository<Position>, Repository<Position>>();
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IOfferRepository, OfferRepository>();

// Configure business services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<IOfferService, OfferService>();
builder.Services.AddScoped<IPdfService, PdfService>();

// Configure JWT authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"] ?? "DefaultSecretKeyForDevelopment12345678";
var key = Encoding.UTF8.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "MEManagementApi",
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"] ?? "MEManagementClient",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Configure CORS for Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular default port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Add controllers
builder.Services.AddControllers();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ME Management API", Version = "v1" });
    
    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Initialize database and seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Ensure database connection is working
    try
    {
        if (context.Database.CanConnect())
        {
            Console.WriteLine("Successfully connected to MySQL database (firmaDB)");
            
            // Try to ensure Users table exists without affecting existing firmaDB tables
            try
            {
                // Check if Users table exists by querying it
                var userExists = context.Users.Any();
                Console.WriteLine("Users table exists");
            }
            catch
            {
                // Users table doesn't exist, try to create it
                Console.WriteLine("Users table not found, attempting to create...");
                try
                {
                    context.Database.ExecuteSqlRaw(@"
                        CREATE TABLE IF NOT EXISTS Users (
                            Id INT AUTO_INCREMENT PRIMARY KEY,
                            Username VARCHAR(100) NOT NULL UNIQUE,
                            PasswordHash VARCHAR(255) NOT NULL,
                            DisplayName VARCHAR(200),
                            Email VARCHAR(200),
                            CreatedAt DATETIME(6) NOT NULL,
                            LastLoginAt DATETIME(6) NULL,
                            INDEX IX_Users_Username (Username)
                        )");
                    Console.WriteLine("Users table created");
                }
                catch (Exception createEx)
                {
                    Console.WriteLine($"Could not create Users table: {createEx.Message}");
                }
            }
            
            // Seed default admin user if needed
            if (!context.Users.Any())
            {
                // Create default admin user (username: admin, password: admin)
                context.Users.Add(new User
                {
                    Username = "admin",
                    PasswordHash = AuthService.HashPassword("admin"),
                    DisplayName = "Administrator",
                    Email = "admin@me-management.de",
                    CreatedAt = DateTime.UtcNow
                });
                
                context.SaveChanges();
                Console.WriteLine("Default admin user created");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection or initialization failed: {ex.Message}");
        Console.WriteLine("Please ensure MySQL is running and connection string is correct.");
    }
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// IMPORTANT: UseCors must be called before UseAuthentication and UseAuthorization
app.UseCors("AllowAngularApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
