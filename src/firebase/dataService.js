import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./config";

const COLLECTION_NAME = "pos_data";

export const defaultSettings = {
  company: "Unyt Mart",
  phone: "+94766802925",
  address: "Main Street, Store HQ",
  logo: "",
  currency: "Rs.",
  delivery: 350,
  tax: 0,
  receiptSize: "80mm", // '58mm', '80mm', 'a6', 'a5', '100%'
  prefix: "UM-",
  footer: "Thank you for your order!",
  dualPrint: false,
};

export const defaultProducts = [];

export const loadUserData = async (uid) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      // Clean up any remaining demo products
      const rawProducts = data.products || [];
      const cleanProducts = rawProducts.filter(
        (p) => !(p.name === "Smart Watch Series 8" || p.name === "Bluetooth Earbuds" || p.name === "Casual T-Shirt")
      );

      return {
        products: cleanProducts,
        sales: data.sales || [],
        settings: { ...defaultSettings, ...(data.settings || {}) },
      };
    } else {
      // Initialize new user data in Firestore with clean empty products
      const initialData = {
        products: [],
        sales: [],
        settings: defaultSettings,
      };
      await setDoc(docRef, initialData);
      return initialData;
    }
  } catch (error) {
    console.error("Failed to load user data from Firestore, checking localStorage fallback", error);
    return loadLocalFallback();
  }
};

export const saveUserData = async (uid, data) => {
  // Always update local cache
  saveLocalFallback(data);

  if (!uid) return;
  try {
    const docRef = doc(db, COLLECTION_NAME, uid);
    await setDoc(docRef, {
      products: data.products || [],
      sales: data.sales || [],
      settings: data.settings || defaultSettings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Cloud sync failed:", error);
    throw error;
  }
};

export const subscribeToUserData = (uid, onUpdate, onError) => {
  if (!uid) return () => {};
  const docRef = doc(db, COLLECTION_NAME, uid);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate({
          products: data.products || [],
          sales: data.sales || [],
          settings: { ...defaultSettings, ...(data.settings || {}) },
        });
      }
    },
    (err) => {
      console.error("Realtime sync snapshot error:", err);
      if (onError) onError(err);
    }
  );
};

export const loadLocalFallback = () => {
  try {
    const p = localStorage.getItem("um_products");
    const s = localStorage.getItem("um_sales");
    const set = localStorage.getItem("um_settings");

    let parsedProducts = p ? JSON.parse(p) : [];
    if (Array.isArray(parsedProducts)) {
      parsedProducts = parsedProducts.filter(
        (prod) => !(prod.name === "Smart Watch Series 8" || prod.name === "Bluetooth Earbuds" || prod.name === "Casual T-Shirt")
      );
    } else {
      parsedProducts = [];
    }

    return {
      products: parsedProducts,
      sales: s ? JSON.parse(s) : [],
      settings: set ? { ...defaultSettings, ...JSON.parse(set) } : defaultSettings,
    };
  } catch (e) {
    console.error("Local storage load failed:", e);
    return {
      products: [],
      sales: [],
      settings: defaultSettings,
    };
  }
};

export const saveLocalFallback = ({ products, sales, settings }) => {
  try {
    if (products) localStorage.setItem("um_products", JSON.stringify(products));
    if (sales) localStorage.setItem("um_sales", JSON.stringify(sales));
    if (settings) localStorage.setItem("um_settings", JSON.stringify(settings));
  } catch (e) {
    console.error("Local storage save failed:", e);
  }
};

export const clearLocalData = () => {
  localStorage.removeItem("um_products");
  localStorage.removeItem("um_sales");
  localStorage.removeItem("um_settings");
};

