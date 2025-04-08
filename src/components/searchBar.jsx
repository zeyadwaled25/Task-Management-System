import React from "react";
const SearchBar = ({ setSearchQuery }) => {
  return (
    <form className="d-flex" role="search">
      <input
        className="form-control me-2 bg-secondary text-white border-0"
        type="search"
        placeholder="Search"
        //علشان كل ما يكتب في الinput يروح للstate بتاع searchQuery
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
};
export default SearchBar;
