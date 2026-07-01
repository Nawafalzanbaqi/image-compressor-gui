using MediatR;
using SoftwareFactory.Application.Common.Behaviours;
using SoftwareFactory.Application.Modules.Content.Dtos;

namespace SoftwareFactory.Application.Modules.Content.Queries.GetContentSection;

/// <summary>
/// Returns visible, ordered content blocks for a storefront section (hero, about,
/// contact, footer, faq, banners). Content is CMS-editable — never hardcoded.
/// </summary>
public sealed record GetContentSectionQuery(string Section)
    : IRequest<ContentSectionDto>, ICacheableQuery
{
    public string CacheKey => $"content:{Section}";
    public TimeSpan? Ttl => TimeSpan.FromMinutes(10);
}
