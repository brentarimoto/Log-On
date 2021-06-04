/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';


/*************************** COMPONENT IMPORTS ***************************/
import { useSearch } from '../../context/Search';


/*************************** CSS ***************************/
import './SearchBar.css'

/*************************** COMPONENTS ***************************/
const SearchBar = () => {

    const {search, setSearch, searchResults, setSearchResults} = useSearch()

    useEffect(async()=>{
        if(search.length){
            const res = await fetch(`/api/search/${search}`);
            const data = await res.json();

            setSearchResults(data.users)
        } else{
            setSearchResults([])
        }
    },[search])

    return (
        <form className='navbar__search'>
            <input
            className={`navbar__search-input ${search && 'navbar__search-active'}`}
            id='navSearch'
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ></input>
            <label htmlFor='navSearch' className="navbar__search-label">Search</label>
            {searchResults.length>0 && <div className='navbar__search-list'>
                {searchResults.map(user=>(
                    <p className='navbar__search-items'>{user.username}</p>
                ))}

            </div>}
        </form>
    );
}


/*************************** EXPORT ***************************/
export default SearchBar;
