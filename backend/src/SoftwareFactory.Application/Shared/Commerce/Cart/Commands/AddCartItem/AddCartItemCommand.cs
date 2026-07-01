using MediatR;
using SoftwareFactory.Application.Shared.Commerce.Cart.Dtos;

namespace SoftwareFactory.Application.Shared.Commerce.Cart.Commands.AddCartItem;

public sealed record AddCartItemCommand(Guid CartId, Guid ProductId, int Quantity)
    : IRequest<CartDto>;
