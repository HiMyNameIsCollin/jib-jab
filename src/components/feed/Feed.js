import React, { useState, useEffect } from 'react'
import Post from '../post/Post'
import './_feed.sass'

const SortOptions = ({openSortOptions, sortOptionsOpen, sortOptionsChoice, setSortOptionsChoice}) => {
	return(
		<div id='sortOptions' onClick={(e) => {
			openSortOptions(!sortOptionsOpen)
		}}>
		    <div> 
		    {
		    	sortOptionsChoice === 'spicy' ?
		    	<React.Fragment>
					<i class="fas fa-pepper-hot"></i>
					<span>Spicy</span>
		    	</React.Fragment> :
		    	sortOptionsChoice === 'best' ?
		    	<React.Fragment>
					<i class="fas fa-poll"></i>
					<span>Best</span>
		    	</React.Fragment> :
		    	sortOptionsChoice === 'dicey' ?
		    	<React.Fragment>
					<i class="fas fa-dice"></i>
					<span>Dicey</span>
		    	</React.Fragment> :
		    	sortOptionsChoice === 'new' ?
		    	<React.Fragment>
					<i class="fas fa-baby"></i>
					<span>New</span>
		    	</React.Fragment> :
		    	null
		    }
				<i class="fas fa-caret-down"></i>
			</div>
			{
				sortOptionsOpen ?
				<div class='dropDownContainer container'>
				    <div onClick={(e)=> {
				    	e.stopPropagation()
				    	setSortOptionsChoice('spicy')
				    	openSortOptions(false)
				    }}> 
						<i class="fas fa-pepper-hot"></i>
						<span>Spicy</span>
					</div>
					<div onClick={(e)=> {
				    	e.stopPropagation()
				    	setSortOptionsChoice('best')
				    	openSortOptions(false)
				    }}> 
						<i class="fas fa-poll"></i>
						<span>Best</span>
					</div>
					<div onClick={(e)=> {
				    	e.stopPropagation()
				    	setSortOptionsChoice('dicey')
				    	openSortOptions(false)
				    }}> 
						<i class="fas fa-dice"></i>
						<span>Dicey</span>
					</div>
					<div onClick={(e)=> {
				    	e.stopPropagation()
				    	setSortOptionsChoice('new')
				    	openSortOptions(false)
				    }}>  
						<i class="fas fa-baby"></i>
						<span>New</span>
					</div>
				</div> :
				null
			}

		</div>
	)
}

const SortOptionsCont = ({sortOptionsContOpen, openSortOptionsCont, sortOptionsContChoice, setSortOptionsChoiceCont}) => {
	return(
		<div id='sortOptionsCont' onClick={() => openSortOptionsCont(!sortOptionsContOpen)}>
		<div>
		{	
			sortOptionsContChoice  === '24' ?
			<span>Past 24 hrs</span> :
			sortOptionsContChoice === 'week' ?
			<span>Past week</span> :
			sortOptionsContChoice === 'month' ?
			<span>Past month</span> :
			sortOptionsContChoice === 'year' ?
			<span>Past year</span> :
			null
		}
			<i class="fas fa-caret-down"></i>
		</div>

		{
			sortOptionsContOpen ?
			<div class='dropDownContainer container'>
				<div onClick={(e)=> {
					e.stopPropagation()
					setSortOptionsChoiceCont('24')
					openSortOptionsCont(false)
				}}> 
					<span>Past 24 hrs</span>
				</div>
				<div onClick={(e)=> {
					e.stopPropagation()
					setSortOptionsChoiceCont('week')
					openSortOptionsCont(false)
				}}> 
					<span>Past week</span>
				</div>
				<div onClick={(e)=> {
					e.stopPropagation()
					setSortOptionsChoiceCont('month')
					openSortOptionsCont(false)
				}}> 
					<span>Past month</span>
				</div>
				<div onClick={(e)=> {
					e.stopPropagation()
					setSortOptionsChoiceCont('year')
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

const DisplayOptions = ({displayOptionsOpen, openDisplayOptions, displayOptionsChoice, setDisplayOptionsChoice}) => {
	return(
		<div id='displayOptions' onClick={() => openDisplayOptions(!displayOptionsOpen)}>
			<div> 
				<i class="fas fa-caret-down"></i>
				{
					displayOptionsChoice === 'card' ?
					<i class="fas fa-square"></i> :
					<i class="fas fa-bars"></i>
				}
				
			</div>
			{
				displayOptionsOpen ?
				<div class='dropDownContainer container'>
					<div> 
						<span>Card view</span>
						<i class="fas fa-square"></i>
					</div>
					<div> 
						<span>List view</span>
						<i class="fas fa-bars"></i>
					</div>
				</div> :
				null
			}
		</div>
	)
}

const Feed = ({userLoggedIn, windowWidth}) => {

	const [sortOptionsOpen, openSortOptions] = useState(false)
	const [sortOptionsContOpen, openSortOptionsCont] = useState(false)
	const [displayOptionsOpen, openDisplayOptions] = useState(false)
	const [sortOptionsChoice, setSortOptionsChoice] = useState('spicy')
	const [sortOptionsContChoice, setSortOptionsChoiceCont] = useState('24')
	const [displayOptionsChoice, setDisplayOptionsChoice] = useState('list')

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

	return(
		<div id='feed'>
			<p className='feedHeader'> Popular posts </p>
			<div className='container'>
				<SortOptions 
				sortOptionsOpen={sortOptionsOpen} 
				openSortOptions={openSortOptions} 
				sortOptionsChoice={sortOptionsChoice} 
				setSortOptionsChoice={setSortOptionsChoice}/>
				{
					sortOptionsChoice === 'best' || sortOptionsChoice === 'dicey' ?
					<SortOptionsCont 
					sortOptionsContOpen={sortOptionsContOpen} 
					openSortOptionsCont={openSortOptionsCont} 
					sortOptionsContChoice={sortOptionsContChoice} 
					setSortOptionsChoiceCont={setSortOptionsChoiceCont}/> :
					null
				}
				<DisplayOptions 
				displayOptionsOpen={displayOptionsOpen} 
				openDisplayOptions={openDisplayOptions} 
				displayOptionsChoice={displayOptionsChoice} 
				setDisplayOptionsChoice={setDisplayOptionsChoice}/>
			</div>
			<Post userLoggedIn={userLoggedIn} windowWidth={windowWidth}/>
			<Post userLoggedIn={userLoggedIn} windowWidth={windowWidth}/>
		</div>
	)
}

export default Feed