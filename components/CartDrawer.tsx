
import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isCartOpen, toggleCart, cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary-600" />
            <h2 className="font-bold text-lg text-gray-900">Your Bag</h2>
            <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">{cart.length} items</span>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Your bag is empty</p>
              <button 
                onClick={() => { toggleCart(); navigate('/marketplace'); }}
                className="text-primary-600 font-bold hover:underline"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-20 h-20 bg-white rounded-lg p-1 border border-gray-200 flex-shrink-0">
                  <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover rounded-md" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product.title}</h3>
                    <p className="text-xs text-gray-500">{item.product.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-primary-600 text-sm">Rs. {item.product.price.toLocaleString()}</span>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gray-400 hover:text-red-500 p-1 self-start transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white safe-area-pb">
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-500 text-sm">Total</span>
              <span className="text-2xl font-bold text-gray-900">Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <button className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
