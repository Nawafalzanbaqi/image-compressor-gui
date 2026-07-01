using FluentValidation;

namespace SoftwareFactory.Application.Modules.Orders.Commands.PlaceOrder;

public sealed class PlaceOrderCommandValidator : AbstractValidator<PlaceOrderCommand>
{
    // TODO(phase-2): validate PaymentMethod against options.json "payments" (tamara/tabi).
    public PlaceOrderCommandValidator()
    {
        RuleFor(x => x.CartId).NotEmpty();
        RuleFor(x => x.CustomerName).NotEmpty().MinimumLength(2);
        RuleFor(x => x.CustomerEmail).NotEmpty().EmailAddress();
        RuleFor(x => x.ShippingAddress).NotEmpty().MinimumLength(5);
        RuleFor(x => x.PaymentMethod).NotEmpty();
    }
}
