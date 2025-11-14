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

  const fetchOffers = async () => {
    const { data: bannerList } = await api.get("/offer-list");
    setBanners(bannerList);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className="homepage-offers">
      <SectionHeader>Top Deals</SectionHeader>
      <SliderList>
        {banners.length &&
          banners.map((banner, index) => (
            <li className="offer-elem" key={index}>
              <Link to="/">
                <img src={normalizeImageURL(banner)} alt="Special offer banner" />
              </Link>
            </li>
          ))}
      </SliderList>
    </div>
  );
};

export default Offers;
