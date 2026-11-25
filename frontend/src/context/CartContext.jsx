import { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartContext.Provider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const saved = localStorage.getItem('foodbite_cart');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        const total = parsed.reduce((sum, item) => sum + (item.unit_price_kobo * item.quantity), 0);
        setTotal(total);
        setItemCount(parsed.length);
      } catch (e) {
        setItems([]);
      }
    }
  };

  const saveCart = (newItems) => {
    setItems(newItems);
    localStorage.setItem('foodbite_cart', JSON.stringify(newItems));
    const total = newItems.reduce((sum, item) => sum + (item.unit_price_kobo * item.quantity), 0);
    setTotal(total);
    setItemCount(newItems.length);
  };

  const addItem = (product, quantity = 1) => {
    const existing = items.find(i => i.product_id === product.id);
    let newItems;
    if (existing) {
      newItems = items.map(i =>
        i.product_id === product.id
          ? { ...i, quantity: i.quantity + quantity, unit_price_kobo: product.price_kobo }
          : i
      );
    } else {
      newItems = [...items, {
        product_id: product.id,
        product_name: product.name,
        quantity,
        unit_price_kobo: product.price_kobo
      }];
    }
    saveCart(newItems);
  };

  const removeItem = (productId) => {
    saveCart(items.filter(i => i.product_id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    saveCart(items.map(i => i.product_id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ items, total, itemCount, addItem, removeItem, updateQuantity, clearCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};