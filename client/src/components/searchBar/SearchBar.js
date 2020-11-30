import React, {useState, useEffect, useRef}from 'react'
import './_searchBar.sass'

const SearchBar = ({Link, setTargetCommunity, searchBarType, user}) => {

	const SearchResult = ({community}) => {
	const [communityImg, setCommunityImg] = useState(undefined)

		useEffect(() => {
			let isMounted = true
				fetch(`http://localhost:3000/img/${community.toLowerCase()}`)
				.then(response => response.json())
				.then(response => {
					if(isMounted) {
						setCommunityImg(response)
					}})
				.catch(err => console.log(err))
				return () => { isMounted = false }
		}, [])

			if(searchBarType === 'header'){
				return(
				<Link 
					onClick={() => {
						setSearchResults([])
						searchRef.current.value = searchRef.current.placeholder
					}}
					to={`/c/${community}`} 
					className='searchResult container'>
					<img src={communityImg} alt='' />
					{community}
				</Link>
				)
			}else if(searchBarType === 'submitPost'){
				return(
					<div onClick={() => {
						setTargetCommunity({name: community, image: communityImg, type: 'community'})
						setSearchResults([])
						searchRef.current.value = searchRef.current.placeholder
					}} className='searchResult container'>
						<img src={communityImg} alt='' />
						{community}
					</div>
				)
			}
		}

	const [searchResults, setSearchResults] = useState([])
	const searchRef = useRef()
	const handleSearch = (e) => {
		if(e.target.value.length > 1){
		fetch('http://localhost:3000/api/search', {
			method: 'post',
			headers: {'Content-Type' : 'application/json'},
			body: JSON.stringify({
				query: e.target.value
			})
		})
		.then(response => response.json())
		.then(response => setSearchResults(response))
		.catch(err => console.log(err))
		}
	}

	return(
		<form className='searchBarDropDown container'>
			<div className='searchBar'>
				<input 
				onClick={() => searchRef.current.value = ''}
				ref={searchRef}
				className='searchBarInput' 
				onChange={handleSearch} 
				type="text" 
				placeholder='Search for community'/>
				<i className="fas fa-search"></i>
			</div>
		{
			searchResults.length > 0 ?
			<div className='searchResultContainer'>
			{
				searchBarType === 'submitPost' ?
				<div onClick={() => {
					setSearchResults([])
					searchRef.current.value = searchRef.current.placeholder
					setTargetCommunity({name: user.userName, image: user.image, type: 'soapBox'})
				}} className='searchResult container'>
					<img src={user.image} alt='' />
					{user.userName}
				</div> :
				null
			}
			{
				searchResults.map((r, i) => {
					return <SearchResult community={r} />
				}) 
			}
			</div> :
			null
		}
		</form>
	)
}

export default SearchBar