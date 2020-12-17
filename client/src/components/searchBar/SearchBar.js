import React, {useState, useRef}from 'react'
import './_searchBar.sass'

const initialResults = {communityArray: [], userArray: []}

const SearchBar = ({Link, setTargetCommunity, searchBarType, user}) => {

	const SearchResult = ({result}) => {

			if(searchBarType === 'header'){
				return(
				<Link 
					onClick={() => {
						setSearchResults([])
						searchRef.current.value = searchRef.current.placeholder
					}}
					to={ result.type === 'community' ? `/c/${result.name}` : `/u/${result.name}`} 
					className='searchResult container'>
					<img src={result.image} alt='' />
					{result.name}
				</Link>
				)
			}else if(searchBarType === 'submitPost'){
				return(
					<div onClick={() => {
						setTargetCommunity({name: result.name, image: result.image, type: result.type })
						setSearchResults(initialResults)
						searchRef.current.value = searchRef.current.placeholder
					}} className='searchResult container'>
						<img src={result.image} alt='' />
						{result.name}
					</div>
				)
			} else if(searchBarType === 'submitMessage') {
				return(
					<div onClick={() => {
						setTargetCommunity({name: result.name, image: result.image, type: result.type})
						setSearchResults(initialResults)
						searchRef.current.value = searchRef.current.placeholder
					}} className='searchResult container'>
						<img src={result.image} alt='' />
						{result.name}
					</div>
					)
			}
		}

	const [searchResults, setSearchResults] = useState(() => initialResults)
	const searchRef = useRef()
	const handleSearch = (e) => {
		fetch('https://jibjab.herokuapp.com/api/search', {
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

	return(
		<form className='searchBarDropDown container'>
			<div className='searchBar'>
				<input 
				onClick={() => {
					searchRef.current.value = ''
					setSearchResults(initialResults)
				}}
				ref={searchRef}
				className='searchBarInput' 
				onChange={handleSearch} 
				type="text" 
				placeholder='Search JibJab' />
				<i className="fas fa-search"></i>
			</div>
			<div className='searchResultContainer' style={{ visibility: 			
			searchResults.communityArray &&
			searchResults.userArray &&
			(searchResults.communityArray.length > 0 || 
			searchResults.userArray.length > 0 )  ? 'visible' : 'hidden'}}>
		{
			searchResults.communityArray &&
			searchResults.userArray &&
			(searchResults.communityArray.length > 0 || 
			searchResults.userArray.length > 0 ) ?
			<React.Fragment>
			{
				searchBarType !== 'submitMessage' ?
				<React.Fragment>
				<h3> Communities ({searchResults.communityArray.length}) </h3>
				{
					searchResults.communityArray.map((r, i) => {
						return <SearchResult result={r} key={i}/>
					})
				}
				{
					user.userName !== '' ?
					<React.Fragment>
						<h3> You: </h3>
						<SearchResult result={{name: user.userName, image: user.configuration.image, type: 'soapBox'}} />
					</React.Fragment> :
					null
				}
				</React.Fragment> :
				null
			}
			{
				searchBarType !== 'submitPost' ?
				<React.Fragment>
				<h3>Users ({searchResults.userArray.length}) </h3>
				{
					searchResults.userArray.map((r, i) => {
						return <SearchResult result={r} key={i}/>
					})
				} 
				</React.Fragment> :
				null
			}

			</React.Fragment> :
			null
		}
			</div> 
		
		</form>
	)
}

export default SearchBar