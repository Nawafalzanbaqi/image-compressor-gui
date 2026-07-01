using System.Text;
using System.Text.RegularExpressions;

namespace SoftwareFactory.Domain.Common;

/// <summary>URL-safe slug value object.</summary>
public sealed partial class Slug : ValueObject
{
    public string Value { get; }

    private Slug(string value) => Value = value;

    public static Slug From(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            throw new ArgumentException("Cannot create a slug from empty text.", nameof(input));

        var normalized = input.Trim().ToLowerInvariant();
        normalized = NonSlugChars().Replace(normalized, "-");
        normalized = MultiDash().Replace(normalized, "-").Trim('-');

        if (normalized.Length == 0)
            normalized = Guid.NewGuid().ToString("n")[..8];

        return new Slug(normalized);
    }

    public override string ToString() => Value;

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }

    [GeneratedRegex("[^a-z0-9\\u0600-\\u06FF]+")]
    private static partial Regex NonSlugChars();

    [GeneratedRegex("-{2,}")]
    private static partial Regex MultiDash();
}
