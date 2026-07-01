using MediatR;
using Microsoft.Extensions.Logging;

namespace SoftwareFactory.Application.Common.Behaviours;

/// <summary>Structured request/response logging for every use case.</summary>
public sealed class LoggingBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehaviour<TRequest, TResponse>> _logger;

    public LoggingBehaviour(ILogger<LoggingBehaviour<TRequest, TResponse>> logger) => _logger = logger;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var name = typeof(TRequest).Name;
        _logger.LogInformation("Handling {RequestName}", name);
        var response = await next();
        _logger.LogInformation("Handled {RequestName}", name);
        return response;
    }
}
