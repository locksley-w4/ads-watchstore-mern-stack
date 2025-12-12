import { useCallback, useContext, useEffect, useState } from "react";
import { api, baseURL } from "../api/api";

export async function fetchFiltered(filter, setLoading) {
  try {
    if (setLoading) setLoading(true);
    const { data } = await api.get("/products", {
      params: filter,
    });

    if (setLoading) setLoading(false);
    return [false, data.data || []];
  } catch (error) {
    if (setLoading) setLoading(false);
    console.error(error);
    return [true, null];
  }
}

export async function fetchProductByID(id, setLoading) {
  try {
    if (setLoading) setLoading(true);
    const { data } = await api.get(`/product`, { params: { id } });
    if (setLoading) setLoading(false);
    return [false, data];
  } catch (error) {
    if (setLoading) setLoading(false);
    console.error(error);
    return [true, null];
  }
}
// fetchProductByID([1,2,4,5])

// export async function getProductsByCategory(category, setLoading) {
//   return await fetchFiltered({ category }, setLoading);
// }

// export function useProduct(id) {
//   // finds product by its ID
//   const [product, setProduct] = useState(null);
//   const { totalProducts } = useContext(ProductsContext);
//   useEffect(() => {
//     setProduct(
//       totalProducts ? totalProducts.find((el) => el.id === +id) : null
//     );
//   }, [id, totalProducts]);
//   return product;
// }

// export function useProducts(arr = []) {
//   const [products, setProducts] = useState({});
//   const { totalProducts = [] } = useContext(ProductsContext);

//   useEffect(() => {
//     if (!arr.length || !totalProducts.length) {
//       setProducts((prev) => (compareObjects(prev, {}) ? prev : {}));
//       return;
//     }
//     const res = {};
//     arr.forEach((id) => {
//       res[id] = totalProducts
//         ? totalProducts.find((el) => el.id === +id)
//         : null;
//     });
//     setProducts((prev) => (compareObjects(prev, res) ? prev : res));
//   }, [arr, totalProducts]);
//   return products;
// }

// export function useSimilarProducts(id, keywords = []) {
//   // finds similar products, using product keywords
//   const [similar, setSimilar] = useState(null);
//   const { totalProducts } = useContext(ProductsContext);
//   useEffect(() => {
//     const matchList = totalProducts.map((product) => {
//       let matches = 0;
//       product.keywords.forEach((keyword) => {
//         if (keywords.includes(keyword)) matches++;
//       });
//       return { product, matches };
//     });
//     let filtered = matchList.filter(
//       (elem) => elem.matches > 0 && elem.product.id !== id
//     );
//     filtered.sort((a, b) => b.matches - a.matches);
//     Array.prototype.pop();
//     // setSimilar(filtered.map((el) => el.product));
//   }, [totalProducts, keywords]);
//   return similar;
// }
export function useSimilarProducts(keywords = []) {
  // finds similar products, using product keywords
  const [similar, setSimilar] = useState(null);
  const [isError, setIsError] = useState(false);

  const fetchSimilar = useCallback(async () => {
    setIsError(false);
    if (!keywords.length) return;
    const [_isError, products] = await fetchFiltered({ categories: keywords });
    if (_isError) setIsError(true);
    if (products?.length > 0) setSimilar(products);
  }, [keywords]);

  useEffect(
    () => {
      if (keywords) fetchSimilar();
    },
    [keywords],
    fetchSimilar
  );
  return [isError, similar];
}

export function binarySearch(elem, arr) {
  if (arr.length <= 1) return elem === arr[0];
  let mid = Math.floor(arr.length / 2);
  if (elem === arr[mid]) return true;
  if (elem < arr[mid]) return binarySearch(elem, arr.slice(0, mid));
  if (elem > arr[mid]) return binarySearch(elem, arr.slice(mid));
}
export function getFilteredProducts(categories = [], totalProducts = []) {
  if (categories.length <= 0) return totalProducts;

  const res = totalProducts.filter((product) => {
    for (const elem of categories) {
      if (product.keywords.includes(elem)) {
        return true;
      }
    }
  });
  return res;
}
export function getSortedProducts(sortBy, products = []) {
  if (!sortBy) return products;
  if (sortBy === "byName")
    return products.sort((a, b) => (a.name >= b.name ? 1 : -1));
  if (sortBy === "byPrice") return products.sort((a, b) => a.price - b.price);
}

export function searchByName(name, products) {
  return products.filter((el) =>
    el.name.toLowerCase().includes(name.toLowerCase().trim())
  );
}

export function compareObjects(a, b) {
  if (!a || !b) return false;
  if (Object.keys(a).length !== Object.keys(b).length) return false;

  for (const key in a) {
    if (Object.prototype.hasOwnProperty.call(a, key) && a[key] !== b[key])
      return false;
  }
  return true;
}

export function normalizeImageURL(url, needPrefix = false) {
  return `${baseURL}${url}`;
}

export function getObjCopy(a) {
  // only shallow copy
  const result = {};
  for (const key in a) {
    if (!Object.hasOwn(a, key)) continue;
    result[key] = a[key];
  }
  return result;
}

export function debounceAsync(clb, timeout) {
  let timerID = null;
  let latestResolve = null;

  return (...args) => {
    clearTimeout(timerID);

    // Reject previous promise if it exists
    if (latestResolve) {
      latestResolve(undefined);
    }

    return new Promise((resolve) => {
      latestResolve = resolve;
      timerID = setTimeout(async () => {
        const value = await clb(...args);
        resolve(value);
        latestResolve = null;
      }, timeout);
    });
  };
}

export function isObjEmpty(obj) {
  return Object.keys({}).length <= 0;
}

// Accepts an array of product IDs and returns an object with ID -> productData mapping
export async function getProductsData(arr) {
  const promises = arr.map((id) => api);
}

export function calculateCartTotal(products, cart) {
  let total = 0;
  for (const product of products) {
    const quantity = cart[product._id];
    if (!quantity) continue;
    total += product.price * cart[product._id];
  }
  return total;
}

async function fillupTestProducts(total = 1) {
  const objects = [];
  const obj = {
    imageUrl: "/uploads/testphoto.jpg",
    nameFull: "Test Watch",
    price: "17",
    description: "qp]w[epdls;fafdm,TEST_WILL_BE_DELETED",
  };
  for (let i = 0; i < total; i++) {
    objects.push(obj);
  }
  const response = await api.post("/product", objects);
  console.log(response.data);
}

async function deleteAllTestProducts() {
  const response = await api.delete("/product", {
    params: { descriptionTag: "qp]w[epdls;fafdm,TEST_WILL_BE_DELETED" },
  });
  //   descriptionTag: "qp]w[epdls;fafdm,TEST_WILL_BE_DELETED" ,
  // });
  console.log(response.data);
}
// deleteAllTestProducts();
// fillupTestProducts(50);
