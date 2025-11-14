import React, { useContext, useEffect, useState } from "react";
import "./FeaturedProducts.css";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import ProductsContainer from "../../../components/ProductsContainer/ProductsContainer";
import Product from "../../../components/Product/Product";
import { ProductsContext } from "../../../context/ProductContextProvider";
import { compareObjects } from "../../../utils/utils";

const FeaturedProducts = React.memo(() => {
  const { totalProducts, fetchProducts } = useContext(ProductsContext);
  const [featured, setFeatured] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchTotal = async () => {
    await fetchProducts({}, setProductsLoading);
  };
  useEffect(() => {
    setFeatured(totalProducts.slice(0, 10));
  }, [totalProducts]);

  useEffect(() => {
    fetchTotal();
  }, []);

  return (
    <div className="homepage-featured">
      <SectionHeader>Featured Products</SectionHeader>
      <ProductsContainer>
        {productsLoading ? (
          <p>Loading..</p>
        ) : (
          featured.length &&
          featured.map((product, index) => (
            <Product key={index} product={product} />
          ))
        )}
      </ProductsContainer>
    </div>
  );
}, (prev, next) => compareObjects(prev, next));

export default FeaturedProducts;
