import React, { useState, useEffect } from 'react'
import './_sortOptionsContainer.sass'

const SortOptionsContainer = ({setUser, user, feedSort, setFeedSort, setError}) => {

	const [sortOptionsOpen, openSortOptions] = useState(false)
	const [sortOptionsContOpen, openSortOptionsCont] = useState(false)
	const [displayOptionsOpen, openDisplayOptions] = useState(false)


	useEffect(() => {
		if(sortOptionsOpen){
			openDisplayOptions(false)
			openSortOptionsCont(false)
		}
	},[sortOptionsOpen])

	useEffect(() => {
		if(displayOptionsOpen){
			openSortOptions(false)
			openSortOptionsCont(false)
		}
	},[displayOptionsOpen])

	useEffect(() => {
		if(sortOptionsContOpen){
			openSortOptions(false)
			openDisplayOptions(false)
		}
	},[sortOptionsContOpen])

	const handleFeedType = () => {
		if(user.userName !== ''){
  			const accessToken = window.localStorage.getItem('accessToken')
			fetch('http://localhost:3000/api/u/settings', {
				headers: {
					authorization: `Bearer ${accessToken}`,
					'Content-Type' : 'application/json'
				}
			})
			.then(response => response.json())
			.then(response => response.success !== true ? setError('There seems to have been an error') : null)
			.catch(err => setError('There seems to have been an error'))
		}

	}

	const SortOptions = ({openSortOptions, sortOptionsOpen, feedSort, setFeedSort}) => {

		return(
			<div className='sortOptions' onClick={(e) => {
				openSortOptions(!sortOptionsOpen)
			}}>
			    <div> 
			    {
			    	feedSort.sortOptionsChoice === 'spicy' ?
			    	<React.Fragment>
						<i className="fas fa-pepper-hot"></i>
						<span>Spicy</span>
			    	</React.Fragment> :
			    	feedSort.sortOptionsChoice === 'best' ?
			    	<React.Fragment>
						<i className="fas fa-poll"></i>
						<span>Best</span>
			    	</React.Fragment> :
			    	feedSort.sortOptionsChoice === 'dicey' ?
			    	<React.Fragment>
						<i className="fas fa-dice"></i>
						<span>Dicey</span>
			    	</React.Fragment> :
			    	feedSort.sortOptionsChoice === 'new' ?
			    	<React.Fragment>
						<i className="fas fa-baby"></i>
						<span>New</span>
			    	</React.Fragment> :
			    	null
			    }
					<i className="fas fa-caret-down"></i>
				</div>
				{
					sortOptionsOpen ?
					<div className='dropDownContainer container'>
					    <p> Sort posts by: </p>
					    <div onClick={(e)=> {
					    	e.stopPropagation()
					    	let feedSortMod = {...feedSort}
					    	feedSortMod.sortOptionsChoice = 'spicy'
					    	setFeedSort(feedSortMod)
					    	openSortOptions(false)
					    }}> 
							<i className="fas fa-pepper-hot"></i>
							<span>Spicy</span>
						</div>
						<div onClick={(e)=> {
					    	e.stopPropagation()
					    	let feedSortMod = {...feedSort}
					    	feedSortMod.sortOptionsChoice = 'best'
					    	setFeedSort(feedSortMod)
					    	openSortOptions(false)
					    }}> 
							<i className="fas fa-poll"></i>
							<span>Best</span>
						</div>
						<div onClick={(e)=> {
					    	e.stopPropagation()
					    	let feedSortMod = {...feedSort}
					    	feedSortMod.sortOptionsChoice = 'dicey'
					    	setFeedSort(feedSortMod)
					    	openSortOptions(false)
					    }}> 
							<i className="fas fa-dice"></i>
							<span>Dicey</span>
						</div>
						<div onClick={(e)=> {
					    	e.stopPropagation()
					    	let feedSortMod = {...feedSort}
					    	feedSortMod.sortOptionsChoice = 'new'
					    	setFeedSort(feedSortMod)
					    	openSortOptions(false)
					    }}>  
							<i className="fas fa-baby"></i>
							<span>New</span>
						</div>
					</div> :
					null
				}

			</div>
		)
	}

	const SortOptionsCont = ({sortOptionsContOpen, openSortOptionsCont, feedSort, setFeedSort}) => {
		return(
			<div className='sortOptionsCont' onClick={() => openSortOptionsCont(!sortOptionsContOpen)}>
			<div>
			{	
				feedSort.sortOptionsContChoice  === 'day' ?
				<span>Day</span> :
				feedSort.sortOptionsContChoice === 'week' ?
				<span>Week</span> :
				feedSort.sortOptionsContChoice === 'month' ?
				<span>Month</span> :
				feedSort.sortOptionsContChoice === 'year' ?
				<span>Year</span> :
				null
			}
				<i className="fas fa-caret-down"></i>
			</div>

			{
				sortOptionsContOpen ?
				<div className='dropDownContainer container'>
				    <p> Sort posts by: </p>
					<div onClick={(e)=> {
						e.stopPropagation()
				    	let feedSortMod = {...feedSort}
				    	feedSortMod.sortOptionsContChoice = 'day'
				    	setFeedSort(feedSortMod)
						openSortOptionsCont(false)
					}}> 
						<span>Past day</span>
					</div>
					<div onClick={(e)=> {
						e.stopPropagation()
				    	let feedSortMod = {...feedSort}
				    	feedSortMod.sortOptionsContChoice = 'week'
				    	setFeedSort(feedSortMod)
						openSortOptionsCont(false)
					}}> 
						<span>Past week</span>
					</div>
					<div onClick={(e)=> {
						e.stopPropagation()
				    	let feedSortMod = {...feedSort}
				    	feedSortMod.sortOptionsContChoice = 'month'
				    	setFeedSort(feedSortMod)
						openSortOptionsCont(false)
					}}> 
						<span>Past month</span>
					</div>
					<div onClick={(e)=> {
						e.stopPropagation()
				    	let feedSortMod = {...feedSort}
				    	feedSortMod.sortOptionsContChoice = 'year'
				    	setFeedSort(feedSortMod)
						openSortOptionsCont(false)
					}}> 
						<span>Past year</span>
					</div>
				</div> :
				null
			}
			</div>
		)
	}

	const DisplayOptions = ({user, setUser , displayOptionsOpen, openDisplayOptions}) => {
		return(
			<div className='displayOptions' onClick={() => openDisplayOptions(!displayOptionsOpen)}>
				<div> 
					<i className="fas fa-caret-down"></i>
					{
						user.settings.feedType === 'card' ?
						<i className="fas fa-square"></i> :
						<i className="fas fa-bars"></i>
					}
					
				</div>
				{
					displayOptionsOpen ?
					<div className='dropDownContainer container'>
						<p>  View posts in:  </p>
						<div onClick={(e) => {
							e.stopPropagation()
							openDisplayOptions(false)
							let userMod = {...user}
							userMod.settings.feedType = 'card' 
							setUser(userMod)
							handleFeedType()
						}}> 
							<span>Card view</span>
							<i className="fas fa-square"></i>
						</div>
						<div onClick={(e) => {
							e.stopPropagation()
							openDisplayOptions(false)
							let userMod = {...user}
							userMod.settings.feedType = 'list'
							setUser(userMod)
							handleFeedType()
						}}> 
							<span>List view</span>
							<i className="fas fa-bars"></i>
						</div>
					</div> :
					null
				}
			</div>
		)
	}

	return(
		<div  className='container'>
			<SortOptions 
			sortOptionsOpen={sortOptionsOpen} 
			openSortOptions={openSortOptions} 
			feedSort={feedSort} 
			setFeedSort={setFeedSort} />
			{
				feedSort.sortOptionsChoice === 'best' || feedSort.sortOptionsChoice === 'dicey' ?
				<SortOptionsCont 
				sortOptionsContOpen={sortOptionsContOpen} 
				openSortOptionsCont={openSortOptionsCont} 
				feedSort={feedSort} 
				setFeedSort={setFeedSort} /> :
				null
			}
			<DisplayOptions 
			setUser={setUser}
			user={user}
			displayOptionsOpen={displayOptionsOpen} 
			openDisplayOptions={openDisplayOptions} />
		</div>
	)
}

export default SortOptionsContainer