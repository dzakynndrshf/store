"use client";
import { useEffect, useState } from 'react';
import { FiShoppingCart, FiX, FiMenu, FiCheckCircle } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const ProductCard = ({ product, addToCart }) => (
  <div className="card p-4 bg-white shadow-lg rounded-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-100">
    <img 
      src={product.image} 
      alt={product.title} 
      className="w-full h-48 object-contain rounded-xl transition-all duration-300"
    />
    <div className="mt-3">
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.title}</h3>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-md font-bold text-indigo-600">${product.price}</span>
        <button 
          onClick={() => addToCart(product)}
          className="px-3 py-1.5 bg-indigo-600 text-white rounded-full font-medium shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-1 text-sm"
        >
          <FiShoppingCart className="text-xs" />
          <span className="hidden xs:inline">Add</span>
        </button>
      </div>
    </div>
  </div>
);

const CartItem = ({ item, removeFromCart }) => (
  <div className="flex items-center justify-between p-3 border-b border-gray-100">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-10 h-10 object-contain rounded-md"
      />
      <div className="truncate">
        <h4 className="text-sm font-medium text-gray-800 truncate">{item.title}</h4>
        <p className="text-xs text-gray-500">${item.price}</p>
      </div>
    </div>
    <button 
      onClick={() => removeFromCart(item.id)}
      className="p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
    >
      <FiX size={16} />
    </button>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.slice(0, 10));
      });
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
    setIsCartOpen(true);
    toast.success(`${product.title} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.error('Item removed from cart');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    toast.promise(
      new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
          setCart([]);
          setIsCartOpen(false);
          resolve();
        }, 1500);
      }),
      {
        loading: 'Processing your order...',
        success: (
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-green-500" />
            <span>Order placed successfully! Total: ${cartTotal.toFixed(2)}</span>
          </div>
        ),
        error: 'Failed to process order',
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        }}
      />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-1 text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-indigo-600">DzStore</h1>
          </div>
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-1 text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <FiShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Products Grid */}
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 px-2">Our Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  addToCart={addToCart}
                />
              ))}
            </div>
          </div>

          {/* Cart Sidebar - Mobile (Bottom Sheet) */}
          {isCartOpen && (
            <div className={`fixed inset-0 z-30 lg:hidden ${isCartOpen ? 'block' : 'hidden'}`}>
              <div 
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setIsCartOpen(false)}
              ></div>
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[70vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">Shopping Cart</h3>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-y-auto flex-1">
                  {cart.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      Your cart is empty
                    </div>
                  ) : (
                    <>
                      {cart.map((item) => (
                        <CartItem 
                          key={`${item.id}-${Math.random()}`} 
                          item={item} 
                          removeFromCart={removeFromCart}
                        />
                      ))}
                    </>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-600">Total:</span>
                      <span className="font-bold text-indigo-600">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cart Sidebar - Desktop */}
          {isCartOpen && (
            <div className="hidden lg:block lg:w-80 bg-white shadow-lg rounded-xl h-fit sticky top-24">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Shopping Cart</h3>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Your cart is empty
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <CartItem 
                        key={`${item.id}-${Math.random()}`} 
                        item={item} 
                        removeFromCart={removeFromCart}
                      />
                    ))}
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-gray-600">Total:</span>
                    <span className="font-bold text-indigo-600">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
