import React, { useContext, useEffect, useState } from "react";
import "./Product.css";
import { useNavigate } from "react-router-dom";
// import path from "path";
import { baseURL } from "../../api/api";
import { normalizeImageURL } from "../../utils/utils";
import { ProductsContext } from "../../context/ProductContextProvider";

const Product = ({ product, ...props }) => {
  const navigate = useNavigate();
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (product.imageUrl) {
      setImageURL(normalizeImageURL(product.imageUrl));
      // console.log(product.imageUrl.match(/\.?\/?.+/));
    }
  }, [product]);

  function referToProductPage() {
    navigate(`/product/${product._id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (!product) {
    return <h2>Product Loading..</h2>;
  }
  return (
    <div className="product" {...props} onClick={referToProductPage}>
      <div className="product-image">
        <img src={imageURL} alt="Watch image" />
      </div>
      <h4>{product?.nameShort}</h4>
      <h3 className="price">$ {product?.price}</h3>
      <button className="add-to-cart-btn">+</button>
    </div>
  );
};

export default Product;
