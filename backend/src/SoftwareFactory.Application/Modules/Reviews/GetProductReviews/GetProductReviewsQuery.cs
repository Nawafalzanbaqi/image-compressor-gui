using MediatR;

namespace SoftwareFactory.Application.Modules.Reviews.GetProductReviews;

// SCAFFOLD module (features.reviews). Same vertical-slice pattern as Products.
public sealed record ReviewDto(Guid Id, Guid ProductId, string AuthorName, int Rating, string? Body);

public sealed record GetProductReviewsQuery(Guid ProductId) : IRequest<IReadOnlyList<ReviewDto>>;
