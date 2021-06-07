/*************************** REACT IMPORTS ***************************/
import React from "react";
import { createContext, useContext, useState } from "react";

/*************************** CONTEXT ***************************/
export const SearchContext = createContext();
export const useSearch = () => useContext(SearchContext);

/*************************** PROVIDER ***************************/
export const SearchProvider = (props) => {

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{ search, setSearch, searchResults, setSearchResults, modalOpen, setModalOpen }}
    >
      {props.children}
    </SearchContext.Provider>
  );
};

/*************************** EXPORT ***************************/
export default SearchProvider;
