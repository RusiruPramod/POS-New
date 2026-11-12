import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  loadUserData,
  saveUserData,
  subscribeToUserData,
  defaultSettings,
  defaultProducts,
  clearLocalData,
} from "../firebase/dataService";

const POSContext = createContext(null);

const filterOutDemoProducts = (list) => {
  if (!Array.isArray(list)) return [];
  return list.filter(
    (p) => !(p.name === "Smart Watch Series 8" || p.name === "Bluetooth Earbuds" || p.name === "Casual T-Shirt")
  );
};

export const POSProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentView, setCurrentView] = useState("pos");
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  // Printing state
  const [activePrintSale, setActivePrintSale] = useState(null);
  const [financePrintData, setFinancePrintData] = useState(null);

  // Cart Form Additions (Delivery, discount, customer, options)
  const [cartDeliveryFee, setCartDeliveryFee] = useState(defaultSettings.delivery || 350);
  const [cartIsFreeDelivery, setCartIsFreeDelivery] = useState(false);
  const [cartShowDeliverySep, setCartShowDeliverySep] = useState(false);
  const [cartDiscount, setCartDiscount] = useState(0);

  // Load initial data and subscribe to Firestore changes when user changes
  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;
    setCloudSyncing(true);

    // Initial load
    loadUserData(currentUser.uid).then((data) => {
      if (isMounted && data) {
        setProducts(filterOutDemoProducts(data.products || []));
        setSales(data.sales || []);
        const loadedSettings = { ...defaultSettings, ...(data.settings || {}) };
        setSettings(loadedSettings);
        setCartDeliveryFee(loadedSettings.delivery || 350);
        setCloudSyncing(false);
        setLastSynced(new Date());
      }
    });

    // Real-time Firestore Sync listener
    const unsubscribe = subscribeToUserData(
      currentUser.uid,
      (remoteData) => {
        if (!isMounted) return;
        if (remoteData.products) setProducts(filterOutDemoProducts(remoteData.products));
        if (remoteData.sales) setSales(remoteData.sales);
        if (remoteData.settings) {
          setSettings((prev) => ({ ...prev, ...remoteData.settings }));
        }
        setLastSynced(new Date());
      },
      (err) => {
        console.warn("Realtime sync warning:", err);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [currentUser]);

  // Cloud sync trigger helper
  const syncChangesToCloud = useCallback(
    async (updatedProducts, updatedSales, updatedSettings) => {
      if (!currentUser) return;
      try {
        setCloudSyncing(true);
        await saveUserData(currentUser.uid, {
          products: updatedProducts ?? products,
          sales: updatedSales ?? sales,
          settings: updatedSettings ?? settings,
        });
        setLastSynced(new Date());
      } catch (err) {
        console.error("Cloud synchronization failed:", err);
      } finally {
        setCloudSyncing(false);
      }
    },
    [currentUser, products, sales, settings]
  );

  // --- CART OPERATIONS ---
  const addToCart = (productId) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod || prod.stock <= 0) {
      alert("Product is out of stock!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        if (existing.qty < prod.stock) {
          return prev.map((item) =>
            item.id === productId ? { ...item, qty: item.qty + 1 } : item
          );
        } else {
          alert("Cannot exceed available stock.");
          return prev;
        }
      }
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const updateCartQty = (productId, delta) => {
    const prod = products.find((p) => p.id === productId);
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;

      const newQty = item.qty + delta;
      if (newQty <= 0) {
        return prev.filter((i) => i.id !== productId);
      }
      if (prod && newQty > prod.stock) {
        alert("Maximum stock limit reached.");
        return prev;
      }
      return prev.map((i) =>
        i.id === productId ? { ...i, qty: newQty } : i
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setCartIsFreeDelivery(false);
    setCartShowDeliverySep(false);
    setCartDeliveryFee(settings.delivery || 0);
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const taxRate = parseFloat(settings.tax || 0);
  const cartTax = (cartSubtotal * taxRate) / 100;
  const effectiveDelivery = cartIsFreeDelivery ? 0 : parseFloat(cartDeliveryFee || 0);
  const cartTotal = Math.max(
    0,
    cartSubtotal + cartTax + effectiveDelivery - parseFloat(cartDiscount || 0)
  );

  // --- FINALIZE SALE ---
  const finalizeSale = async ({ customer, paymentMethod, cashReceived }) => {
    if (cart.length === 0) {
      throw new Error("Cart is empty");
    }

    const invNo = (settings.prefix || "UM-") + Date.now().toString().slice(-6);
    const codAmountVal =
      paymentMethod === "COD"
        ? `${settings.currency || "Rs."} ${cartTotal.toFixed(2)}`
        : "0.00/=";

    const saleRecord = {
      id: invNo,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      tax: cartTax,
      delivery: effectiveDelivery,
      rawDelivery: parseFloat(cartDeliveryFee || 0),
      isFreeDelivery: cartIsFreeDelivery,
      discount: parseFloat(cartDiscount || 0),
      total: cartTotal,
      showDeliverySep: cartShowDeliverySep,
      customer: {
        name: customer.name || "",
        phone: customer.phone || "",
        address: customer.address || "",
        tracking: customer.tracking || "",
      },
      paymentMethod,
      cashReceived: parseFloat(cashReceived || 0),
      codAmount: codAmountVal,
    };

    // Deduct stock
    const updatedProducts = products.map((prod) => {
      const cartMatch = cart.find((c) => c.id === prod.id);
      if (cartMatch) {
        return { ...prod, stock: Math.max(0, prod.stock - cartMatch.qty) };
      }
      return prod;
    });

    const updatedSales = [saleRecord, ...sales];

    setProducts(updatedProducts);
    setSales(updatedSales);
    clearCart();

    await syncChangesToCloud(updatedProducts, updatedSales, settings);
    return saleRecord;
  };

  // --- SALE HISTORY OPERATIONS ---
  const deleteSale = async (saleId) => {
    const saleIdx = sales.findIndex((s) => s.id === saleId);
    if (saleIdx === -1) return;

    const sale = sales[saleIdx];
    // Restore stock
    const updatedProducts = products.map((prod) => {
      const match = sale.items?.find((i) => i.id === prod.id);
      if (match) {
        return { ...prod, stock: prod.stock + match.qty };
      }
      return prod;
    });

    const updatedSales = sales.filter((s) => s.id !== saleId);
    setProducts(updatedProducts);
    setSales(updatedSales);

    await syncChangesToCloud(updatedProducts, updatedSales, settings);
  };

  const editSale = async (saleId) => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return;

    // Restore stock and delete record, populate cart
    const updatedProducts = products.map((prod) => {
      const match = sale.items?.find((i) => i.id === prod.id);
      if (match) {
        return { ...prod, stock: prod.stock + match.qty };
      }
      return prod;
    });

    const updatedSales = sales.filter((s) => s.id !== saleId);

    setProducts(updatedProducts);
    setSales(updatedSales);
    setCart(JSON.parse(JSON.stringify(sale.items || [])));
    setCartDeliveryFee(
      sale.rawDelivery !== undefined ? sale.rawDelivery : sale.delivery || 0
    );
    setCartIsFreeDelivery(sale.isFreeDelivery || false);
    setCartShowDeliverySep(sale.showDeliverySep || false);
    setCartDiscount(sale.discount || 0);

    await syncChangesToCloud(updatedProducts, updatedSales, settings);
    setCurrentView("pos");

    return sale;
  };

  // --- PRODUCTS MANAGEMENT ---
  const saveProduct = async (productData) => {
    let updatedProducts = [];
    if (productData.id) {
      updatedProducts = products.map((p) =>
        p.id === productData.id ? { ...p, ...productData } : p
      );
    } else {
      const newProduct = {
        ...productData,
        id: Date.now(),
      };
      updatedProducts = [newProduct, ...products];
    }

    setProducts(updatedProducts);
    await syncChangesToCloud(updatedProducts, sales, settings);
  };

  const deleteProduct = async (productId) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
    await syncChangesToCloud(updatedProducts, sales, settings);
  };

  // --- SETTINGS MANAGEMENT ---
  const updateSettings = async (newSettings) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    setCartDeliveryFee(merged.delivery || 0);
    await syncChangesToCloud(products, sales, merged);
  };

  // --- IMPORT / EXPORT ---
  const exportProducts = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unyt_mart_products_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importProducts = async (importedList) => {
    if (!Array.isArray(importedList)) {
      throw new Error("Invalid products JSON format");
    }
    setProducts(importedList);
    await syncChangesToCloud(importedList, sales, settings);
  };

  const hardReset = async () => {
    clearLocalData();
    setProducts([]);
    setSales([]);
    setSettings(defaultSettings);
    setCart([]);
    await syncChangesToCloud([], [], defaultSettings);
  };

  // --- PRINTING ---
  const printReceipt = (sale) => {
    setActivePrintSale(sale);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const printFinancialStatement = (data) => {
    setFinancePrintData(data);
    document.body.classList.add("printing-finance");
    setTimeout(() => {
      window.print();
      document.body.classList.remove("printing-finance");
      setFinancePrintData(null);
    }, 150);
  };

  return (
    <POSContext.Provider
      value={{
        products,
        sales,
        settings,
        cart,
        activeCategory,
        currentView,
        cloudSyncing,
        lastSynced,
        cartDeliveryFee,
        cartIsFreeDelivery,
        cartShowDeliverySep,
        cartDiscount,
        cartSubtotal,
        cartTax,
        effectiveDelivery,
        cartTotal,
        activePrintSale,
        financePrintData,
        setActiveCategory,
        setCurrentView,
        setCartDeliveryFee,
        setCartIsFreeDelivery,
        setCartShowDeliverySep,
        setCartDiscount,
        addToCart,
        updateCartQty,
        clearCart,
        finalizeSale,
        deleteSale,
        editSale,
        saveProduct,
        deleteProduct,
        updateSettings,
        exportProducts,
        importProducts,
        hardReset,
        printReceipt,
        printFinancialStatement,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
};

