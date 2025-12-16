import React, { useContext, useEffect, useRef, useState } from "react";
import "./FeaturedProducts.css";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import ProductsContainer from "../../../components/ProductsContainer/ProductsContainer";
import Product from "../../../components/Product/Product";
import { ProductsContext } from "../../../context/ProductContextProvider";
import { compareObjects } from "../../../utils/utils";
import { DotLoader } from "react-spinners";

const FeaturedProducts = React.memo(
  () => {
    const { fetchProducts } = useContext(ProductsContext);
    const [featured, setFeatured] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const feedEndRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const [isError, setIsError] = useState(false);
    const ignore = useRef(false);
    const requestErrorTries = useRef(0);

    const fetchMore = async () => {
      const [error, data, meta] = await fetchProducts(
        { limit: 10, page: page || 1 },
        setProductsLoading
      );
      ignore.current = false;
      if (error) {
        requestErrorTries.current++;
        console.log(error, requestErrorTries.current);
        if (error.status === 429) requestErrorTries.current = 10;
        return setIsError(true);
      }
      setFeatured((prev) => [...prev, ...data]);
      setHasMore(meta?.hasNextPage || false);
    };

    useEffect(() => {
      if (productsLoading || ignore.current) return;
      ignore.current = true;
      fetchMore();
    }, [page]);

    useEffect(() => {
      if (!feedEndRef.current || !hasMore || requestErrorTries.current > 5)
        return;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !productsLoading) {
          setPage((prev) => prev + 1);
        }
      });

      observer.observe(feedEndRef.current);

      return () => observer.disconnect();
    }, [productsLoading, hasMore, requestErrorTries]);

    return (
      <div className="homepage-featured">
        <SectionHeader>Featured Products</SectionHeader>
        <ProductsContainer>
          {featured.length ? (
            featured.map((product, index) => (
              <Product key={index} product={product} />
            ))
          ) : (
            <p>No products to show.</p>
          )}
        </ProductsContainer>
        <div ref={feedEndRef} className="feedEnd" />
        {isError && <p>Loading error</p>}
        {productsLoading && (
          <DotLoader className="feed-loader" color="#d1a851" />
        )}
      </div>
    );
  },
  (prev, next) => compareObjects(prev, next)
);

export default FeaturedProducts;
