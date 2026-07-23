/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { createWixCheckoutSession } from '../lib/wixCMS';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('studio_cab_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('studio_cab_cart', JSON.stringify(cart));
    } catch (err) {
      console.warn('Failed to save cart to localStorage', err);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return;
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const rawPriceNum = typeof product.price === 'number' 
          ? product.price 
          : parseFloat((product.price || '').replace(/[^0-9.]/g, '')) || 0;

        return [
          ...prev,
          {
            id: product.id,
            slug: product.slug || product.id,
            name: product.name || 'Producto Studio CAB',
            price: rawPriceNum,
            formattedPrice: product.price || `$${rawPriceNum.toLocaleString('es-MX')}.00`,
            image: product.image || product.images?.[0] || '',
            category: product.category || 'Muebles',
            sku: product.sku || '',
            quantity: quantity
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const numericSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const formattedSubtotal = `$${numericSubtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const checkoutWithWix = async () => {
    setIsCheckingOut(true);
    try {
      const redirectUrl = await createWixCheckoutSession(cart);
      window.open(redirectUrl, '_blank');
    } catch (err) {
      console.error('Checkout redirect failed', err);
      window.open('https://dilodigitalmx.wixsite.com/website-23/checkout', '_blank');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const checkoutWithWhatsApp = () => {
    if (cart.length === 0) return;
    
    let message = `SW- Hola Studio CAB, me gustaría realizar un pedido de los siguientes muebles de su catálogo:\n\n`;
    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (Cant: ${item.quantity}) - ${item.formattedPrice}\n`;
    });
    message += `\n*Subtotal estimado:* ${formattedSubtotal}\n\n¿Me ayudan a confirmar disponibilidades y coordinar el envío?`;

    const waUrl = `https://wa.me/525516406963?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckingOut,
        totalCount,
        numericSubtotal,
        formattedSubtotal,
        checkoutWithWix,
        checkoutWithWhatsApp
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
