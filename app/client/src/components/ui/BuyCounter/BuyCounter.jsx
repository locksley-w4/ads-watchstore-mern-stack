import React, { useContext, useEffect, useRef, useState } from "react";
import "./BuyCounter.css";
import { UserContext } from "../../../context/UserContextProvider";
import { getObjCopy } from "../../../utils/utils";
import { AuthContext } from "../../../context/AuthContextProvider";
const BuyCounter = ({
  vertical,
  productId,
  stopPropagation = false,
  ...props
}) => {
  const { isAuth } = useContext(AuthContext);
  // const [buyCount, setBuyCount] = useState(0);
  const { cart, handleCartUpdate, setCart } = useContext(UserContext);
  const buyCount = useRef(0);

  useEffect(() => {
    if (!cart) return;
    const productCounter = cart[productId] || 0;
    buyCount.current = productCounter;
    console.log(cart);
    
    // setBuyCount(productCounter);
  }, [cart]);

  async function decrementCounter() {
    if (!isAuth) {
      alert("Login to add to your cart");
      return;
    }
    const currentVal = cart[productId];
    if (!currentVal) return;
    const _prev = getObjCopy(cart);
    buyCount.current--;
    const newVal = currentVal - 1;
    const newCart = { ...cart, [productId]: newVal };
    setCart(newCart);
    await handleCartUpdate(productId, _prev, newCart);
  }
  async function incrementCounter() {
    if (!isAuth) {
      alert("Login to add to your cart");
      return;
    }
    buyCount.current++;
    const _prev = getObjCopy(cart);
    const currentVal = cart[productId];
    const newVal = currentVal ? currentVal + 1 : 1;
    const newCart = { ...cart, [productId]: newVal };
    setCart(newCart);
    await handleCartUpdate(productId, _prev, newCart);
  }
  return (
    <div
      className={`buyCounter ${vertical ? "vertical" : ""}`}
      onClick={stopPropagation ? (e) => e.stopPropagation() : null}
    >
      <button
        onClick={decrementCounter}
        // onClick={() => {
        //   decrementProduct(productId);
        // }}
        className="substract"
      >
        -
      </button>
      <span className="counterValue">{buyCount.current}</span>
      <button
        onClick={incrementCounter}
        // onClick={() => {
        //   incrementProduct(productId);
        // }}
        className="add"
      >
        +
      </button>
    </div>
  );
};

export default BuyCounter;
