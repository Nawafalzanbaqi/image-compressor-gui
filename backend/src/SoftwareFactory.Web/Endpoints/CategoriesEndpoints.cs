using MediatR;
using SoftwareFactory.Application.Modules.Categories.Queries.GetCategories;

namespace SoftwareFactory.Web.Endpoints;

public static class CategoriesEndpoints
{
    public static IEndpointRouteBuilder MapCategoriesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/categories").WithTags("Categories");

        group.MapGet("/", async (ISender sender) =>
            Results.Ok(await sender.Send(new GetCategoriesQuery())));

        return app;
    }
}
