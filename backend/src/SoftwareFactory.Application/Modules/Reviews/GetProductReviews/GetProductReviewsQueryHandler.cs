using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;

namespace SoftwareFactory.Application.Modules.Reviews.GetProductReviews;

public sealed class GetProductReviewsQueryHandler
    : IRequestHandler<GetProductReviewsQuery, IReadOnlyList<ReviewDto>>
{
    private readonly IAppDbContext _db;

    public GetProductReviewsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<ReviewDto>> Handle(GetProductReviewsQuery request, CancellationToken ct)
    {
        return await _db.Reviews.AsNoTracking()
            .Where(r => r.ProductId == request.ProductId && r.Approved)
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new ReviewDto(r.Id, r.ProductId, r.AuthorName, r.Rating, r.Body))
            .ToListAsync(ct);
    }
}
