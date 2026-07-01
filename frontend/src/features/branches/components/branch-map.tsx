interface Props {
  latitude: number;
  longitude: number;
  title: string;
}

/**
 * Static OpenStreetMap embed (no API key, no client JS). The CSP allows
 * frame-src https://www.openstreetmap.org (see next.config.ts). Lazy-loaded.
 * TODO(phase-3): swap for an interactive map provider with geocoding.
 */
export function BranchMap({ latitude, longitude, title }: Props) {
  const d = 0.01;
  const bbox = [longitude - d, latitude - d, longitude + d, latitude + d]
    .map((n) => n.toFixed(5))
    .join("%2C");
  const marker = `${latitude.toFixed(5)}%2C${longitude.toFixed(5)}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;

  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      className="h-56 w-full rounded-md border-0"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
