using System.Text.Json;
using SoftwareFactory.Application.Common.Exceptions;

namespace SoftwareFactory.Web.Middleware;

/// <summary>Maps application exceptions to RFC7807 ProblemDetails responses.</summary>
public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            await WriteProblem(context, StatusCodes.Status400BadRequest, "Validation failed",
                ex.Message, ex.Errors);
        }
        catch (NotFoundException ex)
        {
            await WriteProblem(context, StatusCodes.Status404NotFound, "Not found", ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            await WriteProblem(context, StatusCodes.Status409Conflict, "Conflict", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await WriteProblem(context, StatusCodes.Status500InternalServerError,
                "Server error", "An unexpected error occurred.");
        }
    }

    private static async Task WriteProblem(HttpContext context, int status, string title,
        string detail, IReadOnlyDictionary<string, string[]>? errors = null)
    {
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";

        var payload = new Dictionary<string, object?>
        {
            ["type"] = $"https://httpstatuses.io/{status}",
            ["title"] = title,
            ["status"] = status,
            ["detail"] = detail
        };
        if (errors is not null)
            payload["errors"] = errors;

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
}
