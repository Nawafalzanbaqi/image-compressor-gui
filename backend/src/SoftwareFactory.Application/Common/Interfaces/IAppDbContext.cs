using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Content;
using SoftwareFactory.Domain.Shared.Commerce.Orders;
using SoftwareFactory.Domain.Modules.Products;
using SoftwareFactory.Domain.Modules.Reviews;
using SoftwareFactory.Domain.Modules.Wishlist;
using SoftwareFactory.Domain.Modules.Restaurant;
using CartAggregate = SoftwareFactory.Domain.Shared.Commerce.Cart.Cart;
using CartItemEntity = SoftwareFactory.Domain.Shared.Commerce.Cart.CartItem;

namespace SoftwareFactory.Application.Common.Interfaces;

/// <summary>
/// Persistence contract owned by the Application layer and implemented by
/// Infrastructure's EF Core DbContext. Every new module adds its DbSet here.
/// </summary>
public interface IAppDbContext
{
    DbSet<Product> Products { get; }
    DbSet<Category> Categories { get; }
    DbSet<CartAggregate> Carts { get; }
    DbSet<CartItemEntity> CartItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Review> Reviews { get; }
    DbSet<WishlistItem> WishlistItems { get; }
    DbSet<ContentBlock> ContentBlocks { get; }

    // Restaurant vertical modules.
    DbSet<MenuCategory> MenuCategories { get; }
    DbSet<MenuItem> MenuItems { get; }
    DbSet<Branch> Branches { get; }
    DbSet<RestaurantTable> RestaurantTables { get; }
    DbSet<Reservation> Reservations { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
