using MediatR;
using SoftwareFactory.Application.Modules.Restaurant.Menu.Queries.GetMenu;
using SoftwareFactory.Application.Modules.Restaurant.Menu.Queries.GetMenuItemBySlug;

namespace SoftwareFactory.Web.Endpoints;

/// <summary>Restaurant menu endpoints. Mapped only when siteType == "restaurant".</summary>
public static class MenuEndpoints
{
    public static IEndpointRouteBuilder MapMenuEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/menu").WithTags("Menu");

        group.MapGet("/", async (ISender sender) => Results.Ok(await sender.Send(new GetMenuQuery())));

        group.MapGet("/{slug}", async (string slug, ISender sender) =>
            Results.Ok(await sender.Send(new GetMenuItemBySlugQuery(slug))));

        return app;
    }
}
