using MediatR;
using SoftwareFactory.Application.Modules.Cart.Dtos;

namespace SoftwareFactory.Application.Modules.Cart.Queries.GetCart;

public sealed record GetCartQuery(Guid CartId) : IRequest<CartDto>;
