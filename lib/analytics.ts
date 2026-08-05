export type AnalyticsEvent =
  | "view_item_list" | "view_item" | "search" | "filter_use"
  | "add_to_wishlist" | "add_to_cart" | "remove_from_cart"
  | "begin_checkout" | "purchase" | "wheel_open" | "wheel_spin"
  | "wheel_prize" | "promo_apply" | "cooperation_open" | "cooperation_submit";

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const detail = { event, ...payload, timestamp: Date.now() };
  window.dispatchEvent(new CustomEvent("ego:analytics", { detail }));
  const layer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  layer?.push(detail);
}
