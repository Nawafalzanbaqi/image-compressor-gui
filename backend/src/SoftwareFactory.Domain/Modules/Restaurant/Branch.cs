using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Restaurant;

/// <summary>A physical restaurant location (for the branch locator + map).</summary>
public class Branch : BaseEntity
{
    public string Slug { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public string Address { get; private set; } = default!;
    public string City { get; private set; } = default!;
    public double Latitude { get; private set; }
    public double Longitude { get; private set; }
    public string? Phone { get; private set; }
    public string? OpeningHours { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Branch() { } // EF

    public Branch(string name, string address, string city, double latitude, double longitude,
        string? phone = null, string? openingHours = null, string? slug = null)
    {
        Name = name;
        Address = address;
        City = city;
        Latitude = latitude;
        Longitude = longitude;
        Phone = phone;
        OpeningHours = openingHours;
        Slug = (slug is null ? Common.Slug.From(name) : Common.Slug.From(slug)).Value;
    }
}
