using MediatR;
using SoftwareFactory.Application.Modules.Cart.Dtos;

namespace SoftwareFactory.Application.Modules.Cart.Commands.AddCartItem;

public sealed record AddCartItemCommand(Guid CartId, Guid ProductId, int Quantity)
    : IRequest<CartDto>;
