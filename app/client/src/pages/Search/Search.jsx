import React, { useContext, useEffect, useState } from "react";
import "./Search.css";
import ProductsContainer from "../../components/ProductsContainer/ProductsContainer";
import Product from "../../components/Product/Product";
import { fetchFiltered, searchByName } from "../../utils/utils";
import SearchForm from "../../components/SearchForm/SearchForm";
import { ProductsContext } from "../../context/ProductContextProvider";
import { useParams, useSearchParams } from "react-router-dom";

const Search = () => {
  const [name, setName] = useState("");
  const [filter, setFilter] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [productsLoading, setProductsLoading] = useState(false);
  const [params] = useSearchParams();

  async function handleSearch(e) {
    e?.preventDefault();
    setErrorMsg("");
    if (name) filter.search = name;
    let [isError, filtered] = await fetchFiltered(
      { ...params, ...filter },
      setProductsLoading
    );

    if (isError) {
      setErrorMsg("Unable to load products. Try again later");
    }
    setFilteredProducts(filtered);
  }

  useEffect(() => {
    for (const el of params.entries()) {
      if(el[0] === "name") continue;
      filter[el[0]] = el[1];      
    }
    if (params) handleSearch();
  }, [params]);

  return (
    <div className="search-page">
      <SearchForm onSubmit={handleSearch} value={name} setValue={setName} />
      {errorMsg ? <p>{errorMsg}</p> : ""}
      {productsLoading ? (
        <p>Loading..</p>
      ) : filteredProducts?.length ? (
        <ProductsContainer>
          {filteredProducts.map((elem, i) => (
            <Product product={elem} key={i} />
          ))}
        </ProductsContainer>
      ) : (
        <h2>No products</h2>
      )}
    </div>
  );
};

export default Search;
