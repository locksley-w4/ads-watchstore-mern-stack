import React, { useEffect, useState } from "react";
import "./Offers.css";
import SliderList from "../../../components/ui/SliderList/SliderList";
import { Link } from "react-router-dom";
import SectionHeader from "../../../components/SectionHeader/SectionHeader";
import { api, baseURL } from "../../../api/api";
import { normalizeImageURL } from "../../../utils/utils";
// import {offerBanners} from "../../../components/assets/offerBanners";

const Offers = () => {
  const [banners, setBanners] = useState([]);
  const [isError, setIsError] = useState(false);

  const fetchOffers = async () => {
    try {
      setIsError(false);
      const { data: bannerList } = await api.get("/offer-list");
      setBanners(bannerList);
    } catch (error) {
      setIsError(true);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="homepage-offers">
      <SectionHeader>Top Deals</SectionHeader>
      <SliderList>
        {isError && (<p>No banners available right now.</p>)}
        {banners.length &&
          banners.map((banner, index) => (
            <li className="offer-elem" key={index}>
              <Link to="/">
                <img
                  src={normalizeImageURL(banner)}
                  alt="Special offer banner"
                />
              </Link>
            </li>
          ))}
      </SliderList>
    </div>
  );
};

export default Offers;
