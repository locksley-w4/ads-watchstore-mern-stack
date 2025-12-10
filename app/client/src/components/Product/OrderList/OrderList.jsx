import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContextProvider";
import BuyCounter from "../../ui/BuyCounter/BuyCounter";
import { useNavigate } from "react-router-dom";
import { normalizeImageURL } from "../../../utils/utils";

const OrderList = ({cartProducts, ...props}) => {
  const navigate = useNavigate()

  return (
    <ul className="orders-list">
      {cartProducts && cartProducts.length ? (
        cartProducts.map((product, index) => {
          const id = product._id;
          if (!product)
            return (
              <li key={id}>
                <p>Unable to load product info</p>
              </li>
            );
          return (
            <li className="order-card" key={id} onClick={() => {navigate(`/product/${id}`)}}>
              <div className="logo">
                <img src={normalizeImageURL(product?.imageUrl ?? "#")} alt="Product Image" />
              </div>
              <h2 className="name">{product?.nameShort}</h2>
              <p className="description">{product?.description}</p>
              <h3 className="price">$ {product?.price}</h3>
              <BuyCounter
                vertical={true}
                productId={id}
                stopPropagation={true}
              />
            </li>
          );
        })
      ) : (
        <li key={0}>
          <p>
            No products added yet. Explore and add desired products to your
            cart.
          </p>
        </li>
      )}
      {/* Needs to be done later */}
    </ul>
  );
};

export default OrderList;
