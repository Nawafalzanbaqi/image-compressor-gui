using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Content.Dtos;

namespace SoftwareFactory.Application.Modules.Content.Queries.GetContentSection;

public sealed class GetContentSectionQueryHandler
    : IRequestHandler<GetContentSectionQuery, ContentSectionDto>
{
    private readonly IAppDbContext _db;

    public GetContentSectionQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ContentSectionDto> Handle(GetContentSectionQuery request, CancellationToken ct)
    {
        var section = request.Section.Trim().ToLowerInvariant();

        var blocks = await _db.ContentBlocks.AsNoTracking()
            .Where(b => b.Section == section && b.Visible)
            .OrderBy(b => b.Order)
            .ToListAsync(ct);

        return new ContentSectionDto(section, blocks.Select(ContentBlockDto.From).ToList());
    }
}
