import React, { useContext, useEffect, useState } from "react";
import "./CategoryProducts.css";
import { useParams } from "react-router-dom";
import { compareObjects, fetchFiltered, getProductsByCategory } from "../../../utils/utils";
import Product from "../../../components/Product/Product";
import SliderList from "../../../components/ui/SliderList/SliderList";
import { ProductsContext } from "../../../context/ProductContextProvider";
import { HashLoader } from "react-spinners";

const CategoryProducts = React.memo(({ ...props }) => {
  const [productCategory, setCategory] = useState(null);
  const { category: selectedCategory } = useParams();
  const [errorMsg, setErrorMsg] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    setCategory(selectedCategory);
  }, [selectedCategory]);


  async function fetchCategoryProducts(ignore) {
    if(ignore) return;
    setErrorMsg("");
    ignore = true;
    let [isError, filtered] = await fetchFiltered(
      { categories: selectedCategory ?? "trending" },
      setProductsLoading
    );
    if (isError) {
      setErrorMsg("Unable to load products. Try again later");
    }
    ignore = false;
    setFilteredProducts(filtered);
  }

  useEffect(() => {
    let ignore = false;
    fetchCategoryProducts(ignore);
  }, [productCategory]);

  return (
    <div className="categoryProducts">
      <SliderList className="productsContainer">
        {errorMsg ? <p>{errorMsg}</p> : ""}
        {productsLoading ? (
          <HashLoader className="loader" color="#d1a851" />
        ) : (
          filteredProducts?.length &&
          filteredProducts.map((product, index) => (
            <li className="product" key={index}>
              <Product product={product} />
            </li>
          ))
        )}
      </SliderList>
    </div>
  );
}, (prev, next) => compareObjects(prev, next));

export default CategoryProducts;
