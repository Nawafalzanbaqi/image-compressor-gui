using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SoftwareFactory.Domain.Modules.Content;
using SoftwareFactory.Domain.Modules.Reviews;
using SoftwareFactory.Domain.Modules.Wishlist;

namespace SoftwareFactory.Infrastructure.Persistence.Configurations;

public sealed class ContentBlockConfiguration : IEntityTypeConfiguration<ContentBlock>
{
    public void Configure(EntityTypeBuilder<ContentBlock> builder)
    {
        builder.ToTable("content_blocks");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Section).HasMaxLength(60).IsRequired();
        builder.Property(b => b.Key).HasMaxLength(120).IsRequired();
        builder.Property(b => b.Type).HasMaxLength(60);
        builder.Property(b => b.DataJson).HasColumnType("jsonb");
        builder.HasIndex(b => new { b.Section, b.Order });
    }
}

// SCAFFOLD modules — standard config, gated at the endpoint/seed layer by flags.
public sealed class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("reviews");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.AuthorName).HasMaxLength(120).IsRequired();
        builder.Property(r => r.Body).HasMaxLength(4000);
        builder.HasIndex(r => r.ProductId);
    }
}

public sealed class WishlistItemConfiguration : IEntityTypeConfiguration<WishlistItem>
{
    public void Configure(EntityTypeBuilder<WishlistItem> builder)
    {
        builder.ToTable("wishlist_items");
        builder.HasKey(w => w.Id);
        builder.Property(w => w.OwnerToken).HasMaxLength(120).IsRequired();
        builder.HasIndex(w => new { w.OwnerToken, w.ProductId }).IsUnique();
    }
}
