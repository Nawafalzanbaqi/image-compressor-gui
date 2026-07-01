using FluentAssertions;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Modules.Restaurant.Reservations.Commands.CreateReservation;
using SoftwareFactory.Application.UnitTests.TestSupport;
using SoftwareFactory.Domain.Modules.Restaurant;
using Xunit;

namespace SoftwareFactory.Application.UnitTests.Modules.Restaurant;

public class CreateReservationTests
{
    [Fact]
    public async Task Handle_creates_reservation_for_existing_branch()
    {
        await using var db = TestDb.CreateContext();
        var branch = new Branch("Riyadh", "Olaya", "Riyadh", 24.69, 46.68);
        db.Branches.Add(branch);
        await db.SaveChangesAsync();

        var handler = new CreateReservationCommandHandler(db);
        var command = new CreateReservationCommand(branch.Id, "Khaled", "0500000000",
            "khaled@example.com", 4, DateTime.UtcNow.AddDays(1), "Window seat please");

        var result = await handler.Handle(command, CancellationToken.None);

        result.ReferenceNumber.Should().StartWith("RS-");
        result.Status.Should().Be("Pending");
        result.PartySize.Should().Be(4);
        db.Reservations.Should().ContainSingle();
    }

    [Fact]
    public async Task Handle_throws_when_branch_missing()
    {
        await using var db = TestDb.CreateContext();
        var handler = new CreateReservationCommandHandler(db);
        var command = new CreateReservationCommand(Guid.NewGuid(), "Khaled", "0500000000",
            null, 2, DateTime.UtcNow.AddDays(1), null);

        var act = () => handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public void Validator_rejects_past_date_and_bad_party_size()
    {
        var validator = new CreateReservationCommandValidator();
        var result = validator.Validate(new CreateReservationCommand(
            Guid.NewGuid(), "A", "123", null, 0, DateTime.UtcNow.AddDays(-1), null));
        result.IsValid.Should().BeFalse();
    }
}
