/**
 * Convenience aliases over the generated OpenAPI schemas. Feature `types/`
 * folders re-export from here so components never touch `generated.ts` shape
 * directly.
 */
import type { components } from "./generated";

export type Money = components["schemas"]["Money"];
export type ProductDto = components["schemas"]["ProductDto"];
export type ProductPage = components["schemas"]["ProductPage"];
export type CategoryDto = components["schemas"]["CategoryDto"];
export type CartDto = components["schemas"]["CartDto"];
export type CartItemDto = components["schemas"]["CartItemDto"];
export type AddCartItemRequest = components["schemas"]["AddCartItemRequest"];
export type PlaceOrderRequest = components["schemas"]["PlaceOrderRequest"];
export type OrderDto = components["schemas"]["OrderDto"];
export type OrderItemDto = components["schemas"]["OrderItemDto"];
export type ContentSectionDto = components["schemas"]["ContentSectionDto"];
export type ContentBlockDto = components["schemas"]["ContentBlockDto"];
export type OrderStatus = OrderDto["status"];
