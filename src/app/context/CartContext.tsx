'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ProductoCart {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

interface CartContextType {
  cart: ProductoCart[];
  agregarAlCarrito: (producto: Omit<ProductoCart, 'cantidad'>) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  removerDelCarrito: (id: string) => void;
  vaciarCarrito: () => void;
  totalCarrito: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ProductoCart[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Bandera para evitar sobrescribir localStorage al montar

  // 1. Cargar desde localStorage ÚNICAMENTE al montar el componente
  useEffect(() => {
    try {
     const saved = localStorage.getItem('decoespejos_cart');
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error cargando el carrito desde localStorage:', error);
    } finally {
      setIsLoaded(true); // Ya podemos empezar a guardar cambios futuros
    }
  }, []);

  // 2. Guardar en localStorage solo DESPUÉS de haber leído los datos iniciales
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('decoespejos_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const agregarAlCarrito = (producto: Omit<ProductoCart, 'cantidad'>) => {
    setCart((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) => 
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      removerDelCarrito(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item))
    );
  };

  const removerDelCarrito = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCart([]);
  };

  const totalCarrito = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        agregarAlCarrito, 
        actualizarCantidad, 
        removerDelCarrito, 
        vaciarCarrito, 
        totalCarrito, 
        isCartOpen, 
        setIsCartOpen 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de un CartProvider');
  return context;
}