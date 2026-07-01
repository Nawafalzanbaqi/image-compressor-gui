using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Application.Common.Interfaces;

/// <summary>
/// Generic repository abstraction. Handlers usually use <see cref="IAppDbContext"/>
/// directly, but this is provided for modules that prefer an explicit repository.
/// </summary>
public interface IRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> ListAsync(CancellationToken cancellationToken = default);
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    void Remove(T entity);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
