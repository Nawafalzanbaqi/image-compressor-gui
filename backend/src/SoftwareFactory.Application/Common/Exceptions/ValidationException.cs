namespace SoftwareFactory.Application.Common.Exceptions;

/// <summary>Aggregates FluentValidation failures. Mapped to HTTP 400 ProblemDetails.</summary>
public sealed class ValidationException : Exception
{
    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public ValidationException(IReadOnlyDictionary<string, string[]> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = errors;
    }
}
