namespace SoftwareFactory.Web.Middleware;

/// <summary>Adds baseline security headers to every response (CSP, HSTS, etc.).</summary>
public sealed class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;

    public SecurityHeadersMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var headers = context.Response.Headers;
        headers["X-Content-Type-Options"] = "nosniff";
        headers["X-Frame-Options"] = "DENY";
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        headers["X-XSS-Protection"] = "0"; // modern browsers rely on CSP instead
        headers["Content-Security-Policy"] =
            "default-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";
        headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";

        if (context.Request.IsHttps)
            headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";

        await _next(context);
    }
}
