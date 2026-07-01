using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Content;
using SoftwareFactory.Domain.Modules.Orders;
using SoftwareFactory.Domain.Modules.Products;
using SoftwareFactory.Domain.Modules.Reviews;
using SoftwareFactory.Domain.Modules.Wishlist;
using CartAggregate = SoftwareFactory.Domain.Modules.Cart.Cart;
using CartItemEntity = SoftwareFactory.Domain.Modules.Cart.CartItem;

namespace SoftwareFactory.Infrastructure.Persistence;

public sealed class AppDbContext : DbContext, IAppDbContext
{
    private readonly IDomainEventDispatcher? _dispatcher;

    public AppDbContext(DbContextOptions<AppDbContext> options, IDomainEventDispatcher? dispatcher = null)
        : base(options)
    {
        _dispatcher = dispatcher;
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<CartAggregate> Carts => Set<CartAggregate>();
    public DbSet<CartItemEntity> CartItems => Set<CartItemEntity>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();
    public DbSet<ContentBlock> ContentBlocks => Set<ContentBlock>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Every module's IEntityTypeConfiguration is picked up automatically —
        // adding a new module never requires editing this method.
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entitiesWithEvents = ChangeTracker.Entries<IHasDomainEvents>()
            .Select(e => e.Entity)
            .Where(e => e.DomainEvents.Count > 0)
            .ToList();

        var domainEvents = entitiesWithEvents.SelectMany(e => e.DomainEvents).ToList();

        var result = await base.SaveChangesAsync(cancellationToken);

        if (_dispatcher is not null && domainEvents.Count > 0)
        {
            await _dispatcher.DispatchAsync(domainEvents, cancellationToken);
            foreach (var entity in entitiesWithEvents)
                entity.ClearDomainEvents();
        }

        return result;
    }
}
