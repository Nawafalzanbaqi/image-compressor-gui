using MediatR;
using SoftwareFactory.Application.Modules.Restaurant.Branches.Queries.GetBranches;

namespace SoftwareFactory.Web.Endpoints;

public static class BranchesEndpoints
{
    public static IEndpointRouteBuilder MapBranchesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/branches").WithTags("Branches");

        group.MapGet("/", async (ISender sender) => Results.Ok(await sender.Send(new GetBranchesQuery())));

        return app;
    }
}
