using MediatR;
using SoftwareFactory.Application.Modules.Content.Queries.GetContentSection;

namespace SoftwareFactory.Web.Endpoints;

public static class ContentEndpoints
{
    public static IEndpointRouteBuilder MapContentEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/content").WithTags("Content");

        group.MapGet("/{section}", async (string section, ISender sender) =>
            Results.Ok(await sender.Send(new GetContentSectionQuery(section))));

        return app;
    }
}
