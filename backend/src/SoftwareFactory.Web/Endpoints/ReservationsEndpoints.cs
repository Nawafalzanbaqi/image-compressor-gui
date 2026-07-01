using MediatR;
using SoftwareFactory.Application.Modules.Restaurant.Reservations.Commands.CreateReservation;
using SoftwareFactory.Application.Modules.Restaurant.Reservations.Queries.GetReservationByReference;

namespace SoftwareFactory.Web.Endpoints;

public static class ReservationsEndpoints
{
    public static IEndpointRouteBuilder MapReservationsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/reservations").WithTags("Reservations");

        group.MapPost("/", async (CreateReservationCommand command, ISender sender) =>
        {
            var reservation = await sender.Send(command);
            return Results.Created($"/api/reservations/{reservation.ReferenceNumber}", reservation);
        });

        group.MapGet("/{referenceNumber}", async (string referenceNumber, ISender sender) =>
            Results.Ok(await sender.Send(new GetReservationByReferenceQuery(referenceNumber))));

        return app;
    }
}
