using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;

namespace SoftwareFactory.Application.Modules.Restaurant.Branches.Queries.GetBranches;

public sealed class GetBranchesQueryHandler
    : IRequestHandler<GetBranchesQuery, IReadOnlyList<BranchDto>>
{
    private readonly IAppDbContext _db;

    public GetBranchesQueryHandler(IAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<BranchDto>> Handle(GetBranchesQuery request, CancellationToken ct)
    {
        var branches = await _db.Branches.AsNoTracking()
            .Where(b => b.IsActive)
            .OrderBy(b => b.City).ThenBy(b => b.Name)
            .ToListAsync(ct);

        return branches.Select(BranchDto.From).ToList();
    }
}
