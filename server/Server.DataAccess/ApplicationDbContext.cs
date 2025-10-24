using Microsoft.EntityFrameworkCore;
using Server.BusinessObjects.Entities;

namespace Server.DataAccess;

/// <summary>
/// Main database context for the application.
/// Configured to use SQLite for simplicity and portability.
/// In production, this could be switched to SQL Server or PostgreSQL.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Position> Positions => Set<Position>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<ContractPosition> ContractPositions => Set<ContractPosition>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceLineItem> InvoiceLineItems => Set<InvoiceLineItem>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<OfferLineItem> OfferLineItems => Set<OfferLineItem>();

    // firmaDB entities (MySQL schema mapping)
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<CustomerEntity> CustomersDb => Set<CustomerEntity>();
    public DbSet<ContractEntity> ContractsDb => Set<ContractEntity>();
    public DbSet<PersonEntity> Persons => Set<PersonEntity>();
    public DbSet<PositionEntity> PositionsDb => Set<PositionEntity>();
    public DbSet<InvoiceEntity> InvoicesDb => Set<InvoiceEntity>();
    public DbSet<InvoicePosition> InvoicePositions => Set<InvoicePosition>();
    public DbSet<FinanceEntity> Finances => Set<FinanceEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.DisplayName).HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(200);
        });

        // Configure Customer entity
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(200);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.Address).HasMaxLength(500);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.PostalCode).HasMaxLength(20);
            entity.Property(e => e.Country).HasMaxLength(100);
            entity.Property(e => e.TaxId).HasMaxLength(50);
        });

        // Configure Position entity
        modelBuilder.Entity<Position>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.TaxRate).HasPrecision(5, 2);
            entity.Property(e => e.Unit).HasMaxLength(50);
        });

        // Configure Contract entity
        modelBuilder.Entity<Contract>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ContractNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Contracts)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure ContractPosition entity
        modelBuilder.Entity<ContractPosition>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Quantity).HasPrecision(18, 2);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.TaxRate).HasPrecision(5, 2);
            entity.Property(e => e.Description).HasMaxLength(1000);
            
            entity.HasOne(e => e.Contract)
                .WithMany(c => c.Positions)
                .HasForeignKey(e => e.ContractId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Position)
                .WithMany()
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Invoice entity
        modelBuilder.Entity<Invoice>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.InvoiceNumber).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.InvoiceNumber).IsUnique();
            entity.Property(e => e.Notes).HasMaxLength(2000);
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Invoices)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
                
            entity.HasOne(e => e.Contract)
                .WithMany()
                .HasForeignKey(e => e.ContractId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure InvoiceLineItem entity
        modelBuilder.Entity<InvoiceLineItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Quantity).HasPrecision(18, 2);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.TaxRate).HasPrecision(5, 2);
            entity.Property(e => e.Unit).HasMaxLength(50);
            
            entity.HasOne(e => e.Invoice)
                .WithMany(i => i.LineItems)
                .HasForeignKey(e => e.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Position)
                .WithMany()
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // Configure Offer entity
        modelBuilder.Entity<Offer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OfferNumber).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.OfferNumber).IsUnique();
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Notes).HasMaxLength(2000);
            
            entity.HasOne(e => e.Customer)
                .WithMany()
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure OfferLineItem entity
        modelBuilder.Entity<OfferLineItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Quantity).HasPrecision(18, 2);
            entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            entity.Property(e => e.TaxRate).HasPrecision(5, 2);
            entity.Property(e => e.Unit).HasMaxLength(50);
            
            entity.HasOne(e => e.Offer)
                .WithMany(o => o.LineItems)
                .HasForeignKey(e => e.OfferId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Position)
                .WithMany()
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.SetNull);
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
            entity.ToTable("customer");
            entity.HasKey(e => e.CustomerId);
            
            entity.HasOne(e => e.Address)
                .WithMany()
                .HasForeignKey(e => e.AddressId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<PersonEntity>(entity =>
        {
            entity.ToTable("person");
            entity.HasKey(e => e.PersonId);
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Persons)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.HasOne(e => e.Address)
                .WithMany()
                .HasForeignKey(e => e.AddressId)
                .OnDelete(DeleteBehavior.SetNull);
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
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.HasOne(e => e.Person)
                .WithMany(p => p.Contracts)
                .HasForeignKey(e => e.PersonId)
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.HasOne(e => e.Position)
                .WithMany(p => p.Contracts)
                .HasForeignKey(e => e.PositionId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<InvoiceEntity>(entity =>
        {
            entity.ToTable("invoice");
            entity.HasKey(e => e.InvoiceId);
            
            entity.HasOne(e => e.Customer)
                .WithMany(c => c.Invoices)
                .HasForeignKey(e => e.CustomerId)
                .OnDelete(DeleteBehavior.SetNull);
                
            entity.HasOne(e => e.Contract)
                .WithMany(c => c.Invoices)
                .HasForeignKey(e => e.ContractId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<InvoicePosition>(entity =>
        {
            entity.ToTable("invoice_position");
            entity.HasKey(e => e.InvoicePositionId);
            
            entity.HasOne(e => e.Invoice)
                .WithMany(i => i.InvoicePositions)
                .HasForeignKey(e => e.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<FinanceEntity>(entity =>
        {
            entity.ToTable("finance");
            entity.HasKey(e => e.FinanceId);
            
            entity.HasOne(e => e.Invoice)
                .WithMany(i => i.FinanceRecords)
                .HasForeignKey(e => e.InvoiceId)
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
