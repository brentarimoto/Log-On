/*************************** REACT IMPORTS ***************************/
import React from 'react';


/*************************** COMPONENT IMPORTS ***************************/
import { useSearch } from '../../context/Search';


/*************************** CSS ***************************/
import './SearchBar.css'

/*************************** COMPONENTS ***************************/
const SearchBar = () => {

    const {search, setSearch, searchResults, setSearchResults} = useSearch()

    return (
        <form className='navbar__search'>
            <input
            className="navbar__search-input"
            type="text"
            value={search}
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
            ></input>
        </form>
    );
}


/*************************** EXPORT ***************************/
export default SearchBar;
