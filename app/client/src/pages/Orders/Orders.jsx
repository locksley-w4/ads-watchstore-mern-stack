import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./Orders.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import { UserContext } from "../../context/UserContextProvider";
import OrderList from "../../components/Product/OrderList/OrderList";
import { ProductsContext } from "../../context/ProductContextProvider";
import { calculateCartTotal, fetchProductByID } from "../../utils/utils";
import { HashLoader } from "react-spinners";

const Orders = () => {
  // const { productPrices = {} } = useContext(ProductsContext);
  const { cart, clearCart, fetchCart } = useContext(UserContext);
  const [productsLoading, setProductsLoading] = useState(false);
  const [discount, setDiscount] = useState(0.25);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchCartProducts = useCallback(async () => {
    setErrorMsg(null);
    const ids = Object.keys(cart);
    if (!ids.length) {
      return;
    }
    const [isError, data] = await fetchProductByID(ids, setProductsLoading);

    if (!isError && data) {
      setCartProducts(data);
    } else {
      setErrorMsg("Failed to load cart from the server.");
    }
  }, [cart]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart) fetchCartProducts();
  }, [cart]);

  useEffect(() => {
    if (cartProducts?.length) setTotalPrice(calculateCartTotal(cartProducts, cart));    
  }, [cartProducts]);

  if (productsLoading) {
    return <HashLoader color="#d1a851" style={{ marginTop: "30vh" }} />;
  }

  return (
    <div className="orders-page">
      <PageHeader>
        <h2>My Orders</h2>
        <button type="button" onClick={clearCart}>
          <i className="fa fa-close" />
        </button>
      </PageHeader>
      {errorMsg && <p>{errorMsg}</p>}
      <OrderList cartProducts={cartProducts} />

      <div className="prices">
        <div className="prices__row">
          <h4>Item Total</h4>
          <h4>${totalPrice}</h4>
        </div>
        <div className="prices__row">
          <h4>Discount ({discount * 100}%)</h4>
          <h4>${totalPrice * discount}</h4>
        </div>
        <div className="prices__row free">
          <h4>Delivery fee</h4>
          <h4>Free</h4>
        </div>
        <div className="prices__footer">
          <h4>Grand Total</h4>
          <h4>${totalPrice * (1 - discount)}</h4>
        </div>
      </div>
      <button
        className="myBtn orderBtn"
        onClick={() =>
          alert(
            "Unfortunately, our shops are closed at this time. Please try again later."
          )
        }
      >
        Place order
      </button>
    </div>
  );
};

export default Orders;
