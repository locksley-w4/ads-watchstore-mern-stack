import React, { useContext, useEffect, useState } from "react";
import CheckboxContainer from "../../components/ui/CheckboxContainer/CheckboxContainer";
import RadioCheckboxContainer from "../../components/ui/CheckboxContainer/RadioCheckboxContainer";
import { ProductsContext } from "../../context/ProductContextProvider";

const FilterForm = ({
  formVisible,
  setFormVisible,
  query,
  setQuery,
  showFiltered,
  ...props
}) => {
  const { categories } = useContext(ProductsContext);
  const sortOptions = [
    { name: "By name", value: "nameShort" },
    { name: "By Price", value: "price" },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState("nameShort"); // "name" or "price"

  useEffect(() => {
    if (query) {
      setSelectedCategories(query.categories);
      setSortType(query.sortType);
    }
  }, [query]);

  function showFilteredAndSorted(e) {
    e.preventDefault();
    const newQuery = { categories: selectedCategories, sortBy: sortType };
    setQuery(newQuery);
    showFiltered(newQuery);
    setFormVisible(false);
  }

  return (
    <div className={`filterForm ${formVisible ? "active" : ""}`} {...props}>
      <form id="filterForm">
        <h2>Select Categories</h2>
        <CheckboxContainer
          options={categories}
          checkedValues={selectedCategories}
          setCheckedValues={setSelectedCategories}
        />
        <h2>Sort by</h2>
        <RadioCheckboxContainer
          options={sortOptions}
          checkedValue={sortType}
          setCheckedValue={setSortType}
        />
        <button className="filter-btn" onClick={showFilteredAndSorted}>
          APPLY
        </button>
      </form>
    </div>
  );
};

export default FilterForm;
