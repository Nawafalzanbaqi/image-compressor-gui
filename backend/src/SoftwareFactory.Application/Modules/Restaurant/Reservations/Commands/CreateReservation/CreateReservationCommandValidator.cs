using FluentValidation;

namespace SoftwareFactory.Application.Modules.Restaurant.Reservations.Commands.CreateReservation;

public sealed class CreateReservationCommandValidator : AbstractValidator<CreateReservationCommand>
{
    public CreateReservationCommandValidator()
    {
        RuleFor(x => x.BranchId).NotEmpty();
        RuleFor(x => x.CustomerName).NotEmpty().MinimumLength(2).MaximumLength(200);
        RuleFor(x => x.CustomerPhone).NotEmpty().MinimumLength(6).MaximumLength(40);
        RuleFor(x => x.CustomerEmail).EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.CustomerEmail));
        RuleFor(x => x.PartySize).InclusiveBetween(1, 50);
        RuleFor(x => x.ReservationAtUtc)
            .GreaterThan(DateTime.UtcNow).WithMessage("Reservation time must be in the future.");
    }
}
