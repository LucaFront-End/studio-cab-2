import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
  } = useCart();

  const [checkoutStatus, setCheckoutStatus] = useState('idle'); // 'idle', 'loading', 'success'

  const handleCheckout = () => {
    setCheckoutStatus('loading');
    // Simulate payment process
    setTimeout(() => {
      setCheckoutStatus('success');
      setTimeout(() => {
        clearCart();
        setCheckoutStatus('idle');
        setCartOpen(false);
      }, 2500);
    }, 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${cartOpen ? 'open' : ''}`}
        onClick={() => checkoutStatus === 'idle' && setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>CARRITO DE COMPRAS</h2>
          <button
            className="cart-close-btn clickable"
            onClick={() => setCartOpen(false)}
            disabled={checkoutStatus !== 'idle'}
          >
            ✕
          </button>
        </div>

        {checkoutStatus === 'success' ? (
          <div className="cart-checkout-success">
            <div className="success-icon-wrapper">
              <svg className="checkmark" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h3>¡Pedido Recibido!</h3>
            <p>Tu orden ha sido procesada con éxito. Nos pondremos en contacto a la brevedad.</p>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              {cartItems.length === 0 ? (
                <div className="cart-empty-message">
                  <p>Tu carrito está vacío</p>
                  <button className="cart-shop-btn clickable" onClick={() => setCartOpen(false)}>
                    VER TIENDA
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div className="cart-item anim-fade-in in-view" key={item.id}>
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-category">{item.category}</p>
                      <div className="cart-item-price-row">
                        <span className="cart-item-price">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        <div className="cart-quantity-selector">
                          <button
                            className="qty-btn clickable"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={checkoutStatus !== 'idle'}
                          >
                            -
                          </button>
                          <span className="qty-val">{item.quantity}</span>
                          <button
                            className="qty-btn clickable"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={checkoutStatus !== 'idle'}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="cart-item-remove-btn clickable"
                      onClick={() => removeFromCart(item.id)}
                      disabled={checkoutStatus !== 'idle'}
                      title="Eliminar producto"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal-row">
                  <span>TOTAL:</span>
                  <span className="cart-subtotal-val">${cartTotal.toLocaleString()}</span>
                </div>
                <button
                  className={`cart-checkout-btn clickable ${
                    checkoutStatus === 'loading' ? 'loading' : ''
                  }`}
                  onClick={handleCheckout}
                  disabled={checkoutStatus !== 'idle'}
                >
                  {checkoutStatus === 'loading' ? (
                    <div className="checkout-spinner"></div>
                  ) : (
                    'FINALIZAR COMPRA'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
