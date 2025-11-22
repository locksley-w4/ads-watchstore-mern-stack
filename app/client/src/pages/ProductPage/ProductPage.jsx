import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductByID, useProduct } from "../../utils/utils";
import "./ProductPage.css";
import PageHeader from "../../components/PageHeader/PageHeader";
import BuyCounter from "../../components/ui/BuyCounter/BuyCounter";
import { ProductsContext } from "../../context/ProductContextProvider";
import { normalizeImageURL } from "../../utils/utils";
import SimilarProducts from "../../components/SimilarProducts/SimilarProducts";
import { HashLoader } from "react-spinners";
// import { UserContext } from "../../context/UserContextProvider";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  const descriptionRef = useRef(null);

  async function fetchProduct(ignore) {
    if (ignore) return;
    setErrorMsg("");
    ignore = true;    
    let [isError, result] = await fetchProductByID(
      productId,
      setProductLoading
    );
    if (isError) {
      setErrorMsg("Unable to load products. Try again later");
    }
    ignore = false;
    setProduct(result);
  }

  useEffect(() => {
    let ignore = false;
    fetchProduct(ignore);
  }, [productId]);

  useEffect(() => {
    if (descriptionRef.current?.clientHeight <= 350) {
      descriptionRef.current?.classList.add("active");
    } else {
      descriptionRef.current?.classList.remove("active");
    }
  }, [descriptionRef.current]);

  function toggleDescription(e) {
    if (descriptionRef.current) {
      descriptionRef.current.classList.toggle("active");
    }
  }
  if (!product) {
    return <div>No product to show..</div>;
  }
  if (productLoading) {
    return <HashLoader  color="#d1a851" style={{marginTop: "30vh"}}/>;
  }

  return (
    <div className="product-page">
      <PageHeader>
        <h2>{product?.nameShort}</h2>
        <button>
          <i className="fa fa-bag-shopping"></i>
        </button>
      </PageHeader>
      <div className="product-image">
        <img
          src={normalizeImageURL(product?.imageUrl ?? "#")}
          alt={`${product?.name} - image`}
        />
      </div>
      <div className="main-info">
        {errorMsg ? <p>{errorMsg}</p> : ""}
        <h2 className="name">{product?.nameFull}</h2>
        <h3 className="price">$ {product?.price}</h3>
      </div>
      <BuyCounter productId={productId} />

      <table className="details">
        <tbody>
          <tr>
            <td>Case Diameter</td>
            <td>{product.caseInfo}</td>
          </tr>
          <tr>
            <td>Water Resistance</td>
            <td>{product.waterResistanceInfo}</td>
          </tr>
          <tr>
            <td>Strap color</td>
            <td>{product.strapColor}</td>
          </tr>
          <tr>
            <td>Strap Material</td>
            <td>{product.strapMaterial}</td>
          </tr>
        </tbody>
      </table>
      <div className="description" ref={descriptionRef}>
        {product?.description ?? "This product does not have a description."}
        <button onClick={toggleDescription} className="showDescription">
          <i className="fa fa-chevron-down"></i>
        </button>
      </div>

      <SimilarProducts keywords={product?.categories} productId={product?.id} />
    </div>
  );
};

export default ProductPage;
