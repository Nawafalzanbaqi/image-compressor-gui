using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SoftwareFactory.Domain.Modules.Categories;

namespace SoftwareFactory.Infrastructure.Persistence.Configurations;

public sealed class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Slug).HasMaxLength(220).IsRequired();
        builder.HasIndex(c => c.Slug).IsUnique();

        builder.Property(c => c.Name).HasMaxLength(200).IsRequired();
        builder.Property(c => c.DisplayOrder);
        builder.HasIndex(c => c.ParentId);
    }
}
