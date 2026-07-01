using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Application.Common.Models;

/// <summary>Serialization-friendly money shape (matches openapi Money schema).</summary>
public sealed record MoneyDto(decimal Amount, string Currency)
{
    public static MoneyDto From(Money money) => new(money.Amount, money.Currency);
}
