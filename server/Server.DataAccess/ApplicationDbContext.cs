using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess;

/// <summary>
/// Main database context for the application.
/// Configured to use MySQL database with support for both new entities and existing firmaDB schema.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    
    // firmaDB entities (MySQL schema mapping)
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<CustomerEntity> CustomersDb => Set<CustomerEntity>();
    public DbSet<ContractEntity> ContractsDb => Set<ContractEntity>();
    public DbSet<ContractPosition> ContractPositions => Set<ContractPosition>();
    public DbSet<PositionEntity> PositionsDb => Set<PositionEntity>();
    public DbSet<InvoiceEntity> InvoicesDb => Set<InvoiceEntity>();
    public DbSet<InvoicePosition> InvoicePositions => Set<InvoicePosition>();
    public DbSet<TransactionEntity> Transactions => Set<TransactionEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.DisplayName).HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(200);
        });

        // Configure firmaDB entities (MySQL schema)
        // These entities map to existing tables and should not modify data
        
        modelBuilder.Entity<Address>(entity =>
        {
            entity.ToTable("address");
            entity.HasKey(e => e.AddressId);
        });

        modelBuilder.Entity<CustomerEntity>(entity =>
        {
            entity.ToTable("customer2");
            entity.HasKey(e => e.CustomerId);
        });

        modelBuilder.Entity<PositionEntity>(entity =>
        {
            entity.ToTable("position");
            entity.HasKey(e => e.PositionId);
        });

        modelBuilder.Entity<ContractEntity>(entity =>
        {
            entity.ToTable("contract");
            entity.HasKey(e => e.ContractId);
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Contracts)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ContractPosition>(entity =>
        {
            entity.ToTable("contract_position");
            entity.HasKey(e => e.ContractPositionId);
            
            entity.HasOne(e => e.Contract)
                .WithMany(c => c.ContractPositions)
                .HasForeignKey(e => e.ContractId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Position)
                .WithMany(p => p.ContractPositions)
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<InvoiceEntity>(entity =>
        {
            entity.ToTable("invoice");
            entity.HasKey(e => e.InvoiceId);
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Invoices)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<InvoicePosition>(entity =>
        {
            entity.ToTable("invoice_position");
            entity.HasKey(e => e.InvoicePositionId);
            
            entity.HasOne(e => e.Invoice)
                .WithMany(i => i.InvoicePositions)
                .HasForeignKey(e => e.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Position)
                .WithMany(p => p.InvoicePositions)
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TransactionEntity>(entity =>
        {
            entity.ToTable("transaction");
            entity.HasKey(e => e.TransactionId);
        });
    }
}
