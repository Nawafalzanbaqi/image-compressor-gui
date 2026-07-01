using MediatR;
using SoftwareFactory.Application.Modules.Restaurant.Menu.Dtos;

namespace SoftwareFactory.Application.Modules.Restaurant.Menu.Queries.GetMenuItemBySlug;

public sealed record GetMenuItemBySlugQuery(string Slug) : IRequest<MenuItemDto>;
