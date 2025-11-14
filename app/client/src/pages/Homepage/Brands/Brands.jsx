import React, { useEffect, useState } from "react";
import "./Brands.css";
import SliderList from "../../../components/ui/SliderList/SliderList";
import { Link } from "react-router-dom";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { api } from "../../../api/api";
import { normalizeImageURL } from "../../../utils/utils";

const Brands = () => {
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    const {data: brandList} = await api.get("/brands");
    
    if (brandList) setBrands(brandList);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="homepage-brands">
      <SectionHeader>Search by brand</SectionHeader>
      <SliderList>
        {brands.length ? (
          brands.map((brand, index) => (
            <li className="brand-elem" key={index}>
              <Link to={`/search?brand=${brand.name}`}>
                <img src={normalizeImageURL(brand.imageURL, true)} alt={brand.name} />
              </Link>
            </li>
          ))
        ) : (
          <p>No brands to display</p>
        )}
      </SliderList>
    </div>
  );
};

export default Brands;
