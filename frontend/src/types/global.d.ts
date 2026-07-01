// NextAuth session/user augmentation.
//
// NOTE: we intentionally do NOT augment next-intl's `IntlMessages` here. Doing
// so would make dynamic message keys (e.g. t(`nav.${item.key}`) in the nav)
// type errors. Keys stay typed as `string`, which is what the config-driven nav
// needs.
declare module "next-auth" {
  interface User {
    id?: string;
  }
}

export {};
