using MediatR;
using SoftwareFactory.Application.Shared.Commerce.Cart.Dtos;

namespace SoftwareFactory.Application.Shared.Commerce.Cart.Queries.GetCart;

public sealed record GetCartQuery(Guid CartId) : IRequest<CartDto>;
