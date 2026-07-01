using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SoftwareFactory.Application.Common.Behaviours;

namespace SoftwareFactory.Application;

public static class DependencyInjection
{
    /// <summary>
    /// Registers MediatR (all handlers in this assembly), every FluentValidation
    /// validator, and the cross-cutting pipeline behaviours. Order matters:
    /// Logging -> Validation -> Caching -> handler.
    /// </summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddValidatorsFromAssembly(assembly);

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(CachingBehaviour<,>));

        return services;
    }
}
