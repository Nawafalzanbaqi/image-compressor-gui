using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Content;

/// <summary>
/// Generic, CMS-editable content block for storefront sections that are primarily
/// authored in Payload (Hero, Banners, FAQ, About, Contact, Footer). The backend
/// stores structured overrides / feature-flagged content; the section it belongs to
/// is identified by <see cref="Section"/> (e.g. "hero", "footer", "about").
///
/// Content copy/images/order/visibility are editable — never hardcoded in components.
/// </summary>
public class ContentBlock : BaseEntity
{
    public string Section { get; private set; } = default!;
    public string Key { get; private set; } = default!;
    public string Type { get; private set; } = "text";
    public int Order { get; private set; }
    public bool Visible { get; private set; } = true;

    /// <summary>Free-form JSON payload (serialized) for the block's fields.</summary>
    public string DataJson { get; private set; } = "{}";

    private ContentBlock() { } // EF

    public ContentBlock(string section, string key, string type, int order, string dataJson, bool visible = true)
    {
        Section = section;
        Key = key;
        Type = type;
        Order = order;
        DataJson = dataJson;
        Visible = visible;
    }

    public void SetVisibility(bool visible) { Visible = visible; UpdatedAtUtc = DateTime.UtcNow; }
}
