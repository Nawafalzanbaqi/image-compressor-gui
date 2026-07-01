namespace SoftwareFactory.Domain.Common;

/// <summary>Money value object. Default currency is SAR (Saudi Riyal).</summary>
public sealed class Money : ValueObject
{
    public const string DefaultCurrency = "SAR";

    public decimal Amount { get; }
    public string Currency { get; }

    private Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public static Money Of(decimal amount, string currency = DefaultCurrency)
    {
        if (amount < 0)
            throw new ArgumentOutOfRangeException(nameof(amount), "Money amount cannot be negative.");
        if (string.IsNullOrWhiteSpace(currency))
            throw new ArgumentException("Currency is required.", nameof(currency));
        return new Money(decimal.Round(amount, 2), currency.ToUpperInvariant());
    }

    public static Money Zero(string currency = DefaultCurrency) => new(0m, currency);

    public Money Add(Money other)
    {
        EnsureSameCurrency(other);
        return new Money(Amount + other.Amount, Currency);
    }

    public Money Multiply(int quantity) => new(Amount * quantity, Currency);

    private void EnsureSameCurrency(Money other)
    {
        if (other.Currency != Currency)
            throw new InvalidOperationException($"Currency mismatch: {Currency} vs {other.Currency}.");
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Amount;
        yield return Currency;
    }

    // EF Core owned-type materialization needs a parameterless private ctor.
    private Money() : this(0m, DefaultCurrency) { }
}
