using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Infrastructure.Persistence.Repositories;

/// <summary>Generic EF Core repository. Uses LINQ only — parameterized by construction.</summary>
public sealed class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly AppDbContext _db;

    public Repository(AppDbContext db) => _db = db;

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _db.Set<T>().FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public async Task<IReadOnlyList<T>> ListAsync(CancellationToken cancellationToken = default) =>
        await _db.Set<T>().AsNoTracking().ToListAsync(cancellationToken);

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default) =>
        await _db.Set<T>().AddAsync(entity, cancellationToken);

    public void Remove(T entity) => _db.Set<T>().Remove(entity);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await _db.SaveChangesAsync(cancellationToken);
}
