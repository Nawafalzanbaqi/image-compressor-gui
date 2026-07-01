using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Shared.Commerce.Cart;

public class CartItem : BaseEntity
{
    public Guid CartId { get; private set; }
    public Guid ProductId { get; private set; }
    public string ProductName { get; private set; } = default!;
    public Money UnitPrice { get; private set; } = Money.Zero();
    public int Quantity { get; private set; }

    public Money LineTotal => UnitPrice.Multiply(Quantity);

    private CartItem() { } // EF

    internal CartItem(Guid productId, string productName, Money unitPrice, int quantity)
    {
        ProductId = productId;
        ProductName = productName;
        UnitPrice = unitPrice;
        Quantity = quantity < 1 ? 1 : quantity;
    }

    internal void IncreaseQuantity(int by) => Quantity += by < 1 ? 1 : by;
}
