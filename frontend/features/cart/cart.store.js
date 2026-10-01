let cart = [];
try {
  const data = JSON.parse(localStorage.getItem("fieldwork-cart-v1") || "[]");
  if (Array.isArray(data))
    cart = data
      .filter(
        (i) =>
          Number.isSafeInteger(i.productId) &&
          Number.isSafeInteger(i.quantity) &&
          i.quantity > 0,
      )
      .map((i) => ({
        productId: i.productId,
        quantity: Math.min(i.quantity, 100),
      }));
} catch {}
export const getCart = () => cart.map((i) => ({ ...i }));
export function saveCart(items) {
  cart = items;
  try {
    localStorage.setItem("fieldwork-cart-v1", JSON.stringify(cart));
  } catch {}
  window.dispatchEvent(new Event("cartchange"));
}
export function addToCart(id, stock) {
  const found = cart.find((i) => i.productId === id);
  if (found) {
    if (found.quantity >= stock)
      throw new Error("จำนวนในตะกร้าเท่ากับสต๊อกแล้ว");
    found.quantity++;
  } else cart.push({ productId: id, quantity: 1 });
  saveCart(cart);
}
export const clearCart = () => saveCart([]);
