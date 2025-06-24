import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial
const initialState = {
  user: null,
  isLoggedIn: false,
  cart: [],
  products: [],
  orders: [],
  currentPage: 'home',
  showLogin: false,
  showCart: false,
  selectedCategory: 'all',
  searchTerm: ''
};

// Tipos de acciones
const actionTypes = {
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_CART_QUANTITY: 'UPDATE_CART_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_ORDERS: 'SET_ORDERS',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  TOGGLE_LOGIN: 'TOGGLE_LOGIN',
  TOGGLE_CART: 'TOGGLE_CART',
  SET_SHOW_CART: 'SET_SHOW_CART',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_SEARCH: 'SET_SEARCH'
};

// Reducer
const appReducer = (state, action) => {
  console.log('🔄 Action dispatched:', action.type, action.payload);
  
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        showLogin: false
      };
    
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false
      };
    
    case actionTypes.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }]
        };
      }
    
    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };
    
    case actionTypes.UPDATE_CART_QUANTITY:
      if (action.payload.quantity === 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id)
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    
    case actionTypes.CLEAR_CART:
      return {
        ...state,
        cart: []
      };
    
    case actionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
    
    case actionTypes.SET_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    
    case actionTypes.SET_CURRENT_PAGE:
      console.log('📄 Cambiando página a:', action.payload);
      return {
        ...state,
        currentPage: action.payload
      };
    
    case actionTypes.TOGGLE_LOGIN:
      return {
        ...state,
        showLogin: !state.showLogin
      };
    
    case actionTypes.TOGGLE_CART:
      return {
        ...state,
        showCart: !state.showCart
      };
    
    case actionTypes.SET_SHOW_CART:
      return {
        ...state,
        showCart: action.payload
      };
    
    case actionTypes.SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    
    case actionTypes.SET_SEARCH:
      return {
        ...state,
        searchTerm: action.payload
      };
    
    default:
      console.warn('⚠️ Action type no reconocido:', action.type);
      return state;
  }
};

// Contexto
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setUser: (user) => dispatch({ type: actionTypes.SET_USER, payload: user }),
    logout: () => dispatch({ type: actionTypes.LOGOUT }),
    addToCart: (product) => dispatch({ type: actionTypes.ADD_TO_CART, payload: product }),
    removeFromCart: (productId) => dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: productId }),
    updateCartQuantity: (productId, quantity) => dispatch({ 
      type: actionTypes.UPDATE_CART_QUANTITY, 
      payload: { id: productId, quantity } 
    }),
    clearCart: () => dispatch({ type: actionTypes.CLEAR_CART }),
    setProducts: (products) => dispatch({ type: actionTypes.SET_PRODUCTS, payload: products }),
    setOrders: (orders) => dispatch({ type: actionTypes.SET_ORDERS, payload: orders }),
    setCurrentPage: (page) => dispatch({ type: actionTypes.SET_CURRENT_PAGE, payload: page }),
    toggleLogin: () => dispatch({ type: actionTypes.TOGGLE_LOGIN }),
    toggleCart: () => dispatch({ type: actionTypes.TOGGLE_CART }),
    setShowCart: (show) => dispatch({ type: actionTypes.SET_SHOW_CART, payload: show }),
    setCategory: (category) => dispatch({ type: actionTypes.SET_CATEGORY, payload: category }),
    setSearch: (term) => dispatch({ type: actionTypes.SET_SEARCH, payload: term })
  };

  // Computed values
  const computed = {
    getTotalPrice: () => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0),
    getTotalItems: () => state.cart.reduce((total, item) => total + item.quantity, 0),
    getFilteredProducts: () => {
      return state.products.filter(product => {
        const matchesCategory = state.selectedCategory === 'all' || product.category === state.selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                             product.brand.toLowerCase().includes(state.searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    }
  };

  return (
    <AppContext.Provider value={{ state, actions, computed }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};