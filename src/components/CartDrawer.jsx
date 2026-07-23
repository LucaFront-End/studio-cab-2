import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    isCheckingOut,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    formattedSubtotal,
    checkoutWithWix,
    checkoutWithWhatsApp
  } = useCart();

  if (!isCartOpen) return null;

  return createPortal(
    <div className="cart-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-group">
            <span className="cart-drawer-eyebrow">[CARRITO DE COMPRAS]</span>
            <h2 className="cart-drawer-heading">Tu Pedido ({totalCount})</h2>
          </div>
          <button 
            className="cart-drawer-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="cart-empty-icon">🛒</div>
              <h3>Tu carrito está vacío</h3>
              <p>Explora nuestro catálogo de muebles sobre diseño y piezas de autor.</p>
              <Link 
                to="/tienda" 
                className="cart-empty-btn" 
                onClick={() => setIsCartOpen(false)}
              >
                Ver Tienda de Muebles
              </Link>
            </div>
          ) : (
            <div className="cart-drawer-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-img-box">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-category">{item.category}</span>
                    <h4 className="cart-item-title">{item.name}</h4>
                    <span className="cart-item-price">{item.formattedPrice}</span>

                    <div className="cart-item-actions">
                      <div className="cart-qty-control">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        className="cart-item-remove-btn" 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Eliminar producto"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal estimado:</span>
              <span className="cart-summary-total">{formattedSubtotal}</span>
            </div>

            <p className="cart-shipping-note">
              * El costo final de envío se coordina según la ubicación de entrega (CDMX o resto de México).
            </p>

            <div className="cart-checkout-actions">
              <button 
                className="cart-btn-wix" 
                onClick={checkoutWithWix}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Redirigiendo a Pago Seguro Wix...' : 'Finalizar Compra en Wix Stores 💳'}
              </button>
              <button className="cart-btn-wa" onClick={checkoutWithWhatsApp}>
                Pedir por WhatsApp 💬
              </button>
            </div>

            <div className="cart-footer-meta">
              <button className="cart-clear-link" onClick={clearCart}>
                Vaciar carrito
              </button>
              <span className="cart-secure-text">🔒 Compra directa respaldada por Grupo CAB Studio</span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
