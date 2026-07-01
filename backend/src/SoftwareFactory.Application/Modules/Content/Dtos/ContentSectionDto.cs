using System.Text.Json;
using SoftwareFactory.Domain.Modules.Content;

namespace SoftwareFactory.Application.Modules.Content.Dtos;

public sealed record ContentBlockDto(string Key, string Type, int Order, bool Visible, JsonElement Data)
{
    public static ContentBlockDto From(ContentBlock b)
    {
        JsonElement data;
        try
        {
            data = JsonSerializer.Deserialize<JsonElement>(
                string.IsNullOrWhiteSpace(b.DataJson) ? "{}" : b.DataJson);
        }
        catch (JsonException)
        {
            data = JsonSerializer.Deserialize<JsonElement>("{}");
        }
        return new ContentBlockDto(b.Key, b.Type, b.Order, b.Visible, data);
    }
}

public sealed record ContentSectionDto(string Section, IReadOnlyList<ContentBlockDto> Blocks);
