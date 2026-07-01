using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Reviews;

/// <summary>
/// Product review. SCAFFOLD module — follows the identical vertical-slice pattern
/// as Products/Orders and is gated by <c>features.reviews</c> in options.json.
/// TODO(phase-2): moderation workflow, verified-purchase check, helpful votes.
/// </summary>
public class Review : BaseEntity
{
    public Guid ProductId { get; private set; }
    public string AuthorName { get; private set; } = default!;
    public int Rating { get; private set; }
    public string? Body { get; private set; }
    public bool Approved { get; private set; }

    private Review() { } // EF

    public Review(Guid productId, string authorName, int rating, string? body = null)
    {
        ProductId = productId;
        AuthorName = authorName;
        Rating = Math.Clamp(rating, 1, 5);
        Body = body;
        Approved = false;
    }

    public void Approve() { Approved = true; UpdatedAtUtc = DateTime.UtcNow; }
}
