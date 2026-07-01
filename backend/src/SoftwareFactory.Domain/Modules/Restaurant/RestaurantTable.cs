using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Restaurant;

/// <summary>A bookable table at a branch. Named RestaurantTable to avoid the SQL "table" clash.</summary>
public class RestaurantTable : BaseEntity
{
    public Guid BranchId { get; private set; }
    public string Label { get; private set; } = default!;
    public int Seats { get; private set; }
    public bool IsActive { get; private set; } = true;

    private RestaurantTable() { } // EF

    public RestaurantTable(Guid branchId, string label, int seats)
    {
        BranchId = branchId;
        Label = label;
        Seats = seats < 1 ? 1 : seats;
    }
}
