import React, { createContext, useEffect, useState } from "react";
import { api } from "../api/api";

export const ProductsContext = createContext(null);

export default function ProductContextProvider({ children }) {
  const [totalProducts, setTotalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeProduct, setActiveProduct] = useState({}); // for setting active elem data for product page

  const fetchCategories = async (filter, setLoading) => {
    try {
      if (setLoading) setLoading(true);
      const { data } = await api.get("/categories", { params: filter });
      const categoryNames = data.map((obj) => {
        return { name: obj.name, value: obj.name };
      });
      if (setLoading) setLoading(false);
      setCategories(categoryNames);
    } catch (err) {
      if (setLoading) setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    <ProductsContext.Provider
      value={{ fetchProducts, totalProducts, categories, activeProduct, setActiveProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
