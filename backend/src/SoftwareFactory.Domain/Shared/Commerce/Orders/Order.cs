using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Shared.Commerce.Orders;

/// <summary>Order aggregate root. Created at checkout from a cart snapshot.</summary>
public class Order : BaseEntity
{
    private readonly List<OrderItem> _items = new();

    public string OrderNumber { get; private set; } = default!;
    public OrderStatus Status { get; private set; } = OrderStatus.Pending;
    public string CustomerName { get; private set; } = default!;
    public string CustomerEmail { get; private set; } = default!;
    public string? CustomerPhone { get; private set; }
    public string ShippingAddress { get; private set; } = default!;
    public string PaymentMethod { get; private set; } = default!;
    public Money Total { get; private set; } = Money.Zero();
    public DateTime PlacedAtUtc { get; private set; } = DateTime.UtcNow;

    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    private Order() { } // EF

    public Order(string customerName, string customerEmail, string shippingAddress,
        string paymentMethod, string? customerPhone = null)
    {
        OrderNumber = GenerateOrderNumber();
        CustomerName = customerName;
        CustomerEmail = customerEmail;
        ShippingAddress = shippingAddress;
        PaymentMethod = paymentMethod;
        CustomerPhone = customerPhone;
    }

    public void AddItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        _items.Add(new OrderItem(productId, productName, unitPrice, quantity));
        RecalculateTotal();
    }

    public void MarkPaid() => Transition(OrderStatus.Paid);
    public void MarkShipped() => Transition(OrderStatus.Shipped);
    public void MarkDelivered() => Transition(OrderStatus.Delivered);
    public void Cancel() => Transition(OrderStatus.Cancelled);

    public void Place()
    {
        if (_items.Count == 0)
            throw new InvalidOperationException("Cannot place an order with no items.");
        Raise(new OrderPlacedDomainEvent(Id, OrderNumber, Total.Amount, Total.Currency));
    }

    private void Transition(OrderStatus next)
    {
        Status = next;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    private void RecalculateTotal() =>
        Total = _items.Aggregate(Money.Zero(Total.Currency), (sum, i) => sum.Add(i.LineTotal));

    /// <summary>Human-friendly, sortable order number, e.g. SF-20260701-AB12CD.</summary>
    public static string GenerateOrderNumber()
    {
        var stamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var rand = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();
        return $"SF-{stamp}-{rand}";
    }
}
