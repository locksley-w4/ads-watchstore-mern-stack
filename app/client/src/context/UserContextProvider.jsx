import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthContextProvider";
import { compareObjects, debounceAsync, isObjEmpty } from "../utils/utils";
import { api } from "../api/api";
import debounce from "debounce";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const { isAuth, user, setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cart, setCart] = useState(null);

  async function fetchUserData(ignore, setLoading, setError) {
    if (ignore) return;
    try {
      setLoading(true);
      const { data } = await api.get("/user");
      ignore = false;
      setLoading(false);
      if (data.user) {
        setUser(data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("cart", JSON.stringify(data.user.cart));
      }
    } catch (error) {
      console.error(error);
      ignore = false;
      setLoading(false);
      if (setError) {
        setError({
          message:
            error?.response?.data?.message || "Error while retriving user data",
        });
      }
    }
  }

  useEffect(() => {
    if (!isAuth) {
      return;
    }

    let ignore = false;
    try {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      const cartData = JSON.parse(sessionStorage.getItem("cart"));
      if (Object.keys(userData).length <= 0) throw new Error();
      console.log(userData, cartData);

      setUser(userData);
      setCart(cartData);
    } catch (error) {
      fetchUserData(ignore, setIsLoading);
    }
  }, [isAuth]);

  useEffect(() => {
    if (!isObjEmpty(cart)) {
      console.log(cart, sessionStorage.getItem("cart"));
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const updateCart = useMemo(
    () =>
      debounceAsync(async (id, qty) => {
        const { data } = await api.put(`/cart/set/${id}`, { quantity: qty });
        console.log(data);
        return data.cart;
      }, 2000),
    []
  );

  function clearCart() {
    // setCart(new Cart({}));
  }

  async function handleCartUpdate(id, prev, updatedCart) {
    try {
      if (!cart) return;
      const newCart = await updateCart(id, updatedCart[id]);

      if (!newCart) return;

      // newCart -- Server synced / updatedCart -- Client synced
      if (!compareObjects(newCart, updatedCart)) {
        setCart(newCart);
      }
    } catch (error) {
      console.error(error);
      setCart(prev);
    }
  }

  return (
    <UserContext.Provider
      value={{
        fetchUserData,
        handleCartUpdate,
        setCart,
        cart,
        clearCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
