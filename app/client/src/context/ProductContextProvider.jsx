import React, { createContext, useState } from "react";
import { api } from "../api/api";

export const ProductsContext = createContext(null);

export default function ProductContextProvider({ children }) {
  const [totalProducts, setTotalProducts] = useState([]);

  const fetchProducts = async (filter, setLoading) => {
    // const data = []
    try {
      if (setLoading) setLoading(true);
      const { data } = await api.get("/products", { params: filter });      
      if (setLoading) setLoading(false);
      setTotalProducts(data);
    } catch (err) {
      if (setLoading) setLoading(false);
      console.error(err);
    }
  };

  return (
    <ProductsContext.Provider value={{ fetchProducts, totalProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
