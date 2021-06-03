import React from "react";
import { createContext, useContext, useState } from "react";

export const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

export const SearchProvider = (props) => {

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  return (
    <SearchContext.Provider
      value={{ search, setSearch, searchResults, setSearchResults }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
