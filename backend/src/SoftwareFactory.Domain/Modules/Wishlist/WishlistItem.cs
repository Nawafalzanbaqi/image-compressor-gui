using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Wishlist;

/// <summary>
/// SCAFFOLD module — wishlist entry keyed by an anonymous/user token.
/// Follows the standard vertical-slice pattern; toggled via nav/route config.
/// TODO(phase-2): associate with authenticated user id, move-to-cart action.
/// </summary>
public class WishlistItem : BaseEntity
{
    public string OwnerToken { get; private set; } = default!;
    public Guid ProductId { get; private set; }

    private WishlistItem() { } // EF

    public WishlistItem(string ownerToken, Guid productId)
    {
        OwnerToken = ownerToken;
        ProductId = productId;
    }
}
