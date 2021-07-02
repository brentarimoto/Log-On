/*************************** REACT IMPORTS ***************************/
import React, { useEffect } from 'react';


/*************************** COMPONENT IMPORTS ***************************/
import UserSearchModal from '../User/UserSearchModal';
import { useSearch } from '../../context/Search';


/*************************** CSS ***************************/
import './SearchBar.css'

/*************************** COMPONENTS ***************************/
const SearchBar = ({socket}) => {

    const {search, setSearch, searchResults, setSearchResults} = useSearch()

    useEffect(()=>{
        (async ()=>{
            if(search.length){
                const res = await fetch(`/api/search/${search}`);
                const data = await res.json();

                setSearchResults(data.users)
            } else{
                setSearchResults([])
            }
        })();
    },[search, setSearchResults])

    return (
        <form className='navbar__search' onSubmit={(e)=>e.preventDefault()}>
            <input
            className={`navbar__search-input ${search && 'navbar__search-active'}`}
            id='navSearch'
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete='off'
            ></input>
            <label htmlFor='navSearch' className="navbar__search-label">Search</label>
            <div className='navbar__search-background'>

            </div>
            {searchResults.length>0 && <div className='navbar__search-list'>
                {searchResults.map(user=>(
                    <UserSearchModal key={user.id} user={user} setSearch={setSearch} setSearchResults={setSearchResults} classname='navbar' socket={socket}/>
                ))}
            </div>}
        </form>
    );
}


/*************************** EXPORT ***************************/
export default SearchBar;
