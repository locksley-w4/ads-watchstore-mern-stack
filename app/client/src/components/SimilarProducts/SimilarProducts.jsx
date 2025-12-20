import React, { useState } from "react";
import "./SimilarProducts.css";
import SectionHeader from "../SectionHeader/SectionHeader";
import ProductsContainer from "../ProductsContainer/ProductsContainer";
import { useSimilarProducts } from "../../utils/utils";
import Product from "../Product/Product";

const SimilarProducts = ({ keywords, ...props }) => {
  const [isError, similar] = useSimilarProducts(keywords);
  
  if (!similar) {
    return <div>No similar products! {isError && <p>Error occured</p>}</div>;
  }

  return (
    <div className="similar-products" {...props}>
      <SectionHeader replace={true} seeAllLink="/">Similar Products</SectionHeader>
      <ProductsContainer>
        {similar.length ?
          similar.map((product, index) => (
            <Product key={index} product={product} />
          ))
        : (<h3>No similar products to display.</h3>)
        }
      </ProductsContainer>
    </div>
  );
};

export default SimilarProducts;
