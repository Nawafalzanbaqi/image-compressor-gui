using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Cart;

/// <summary>Shopping cart aggregate root — owns its items and enforces invariants.</summary>
public class Cart : BaseEntity
{
    private readonly List<CartItem> _items = new();

    public IReadOnlyCollection<CartItem> Items => _items.AsReadOnly();
    public string Currency { get; private set; } = Money.DefaultCurrency;

    public Money Subtotal =>
        _items.Aggregate(Money.Zero(Currency), (sum, item) => sum.Add(item.LineTotal));

    public int ItemCount => _items.Sum(i => i.Quantity);

    public Cart() { }

    public Cart(Guid id) => Id = id;

    public void AddItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        Currency = unitPrice.Currency;
        var existing = _items.FirstOrDefault(i => i.ProductId == productId);
        if (existing is not null)
            existing.IncreaseQuantity(quantity);
        else
            _items.Add(new CartItem(productId, productName, unitPrice, quantity));
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void RemoveItem(Guid productId)
    {
        _items.RemoveAll(i => i.ProductId == productId);
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public void Clear()
    {
        _items.Clear();
        UpdatedAtUtc = DateTime.UtcNow;
    }
}
