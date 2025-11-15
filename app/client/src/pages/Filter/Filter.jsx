import React, { useContext, useEffect, useState } from "react";
import "./Filter.css";
import FilterForm from "./FilterForm";
import ProductsContainer from "../../components/ProductsContainer/ProductsContainer";
import PageHeader from "../../components/PageHeader/PageHeader";
import {
  fetchFiltered,
  getFilteredProducts,
  getSortedProducts,
} from "../../utils/utils";
import Product from "../../components/Product/Product";
import { ProductsContext } from "../../context/ProductContextProvider";

const Filter = (props) => {
  const [query, setQuery] = useState({});
  const [formVisible, setFormVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filtered, setFiltered] = useState([]);

  // const { totalProducts } = useContext(ProductsContext);

  // function showFilteredAndSorted() {
  //   const filtered = getFilteredProducts(query.categories, totalProducts);
  //   setFilteredAndSorted(getSortedProducts(query.sortType, filtered));
  // }
  async function showFiltered(query) {
    setErrorMsg("");
    const [isError, filtered] = await fetchFiltered(query, setIsLoading);
    if (isError) {
      setErrorMsg("Unable to load products. Try again later");
      return;
    }
    setFiltered(filtered);
  }
  // useEffect(() => {
  //   if (!formVisible) showFilteredAndSorted();
  // }, [formVisible]);

  function clear() {
    const userConfirm = window.confirm("Do you want to reset filter?");
    if (userConfirm) setQuery({ name: "", categories: [] });
  }

  return (
    <div className="filterPage" {...props}>
      <PageHeader>
        <h2>Filter</h2>
        <button onClick={clear}>
          <i className="fa fa-close"></i>
        </button>
      </PageHeader>
      <FilterForm
        formVisible={formVisible}
        setFormVisible={setFormVisible}
        query={query}
        setQuery={setQuery}
        showFiltered={showFiltered}
      />
      <button
        className="filter-btn"
        onClick={() => {
          setFormVisible(true);
        }}
      >
        Show Form
      </button>
      <ProductsContainer className={formVisible ? "collapsed" : ""}>
        {errorMsg ? <p>{errorMsg}</p> : ""}
        {isLoading ? (
          <p>Loading..</p>
        ) : filtered.length ? (
          filtered.map((elem, i) => <Product product={elem} key={i} />)
        ) : (
          <p>No products to display. Please edit your filters.</p>
        )}
      </ProductsContainer>
    </div>
  );
};

export default Filter;
