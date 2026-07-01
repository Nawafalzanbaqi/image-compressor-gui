import type { ReactNode } from "react";

/**
 * Layout for the Payload admin route group. It lives OUTSIDE the [locale]
 * segment (the admin UI is not localized), so it renders its own html/body.
 */
export default function PayloadLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
