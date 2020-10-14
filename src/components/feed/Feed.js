import React, { useState } from 'react'
import Post from '../post/Post'
import './_feed.sass'

const SortOptions = ({openSortOptions, sortOptionsOpen}) => {


	return(
		<div id='sortOptions' onClick={() => openSortOptions(!sortOptionsOpen)}>
		    <div> 
				<i class="fas fa-pepper-hot"></i>
				<span>Spicy</span>
				<i class="fas fa-caret-down"></i>
			</div>
			{
				sortOptionsOpen ?
				<div class='dropDownContainer container'>
					<div> 
						<i class="fas fa-poll"></i>
						<span>Best</span>
					</div>
					<div> 
						<i class="fas fa-dice"></i>
						<span>Dicey</span>
					</div>
					<div> 
						<i class="fas fa-baby"></i>
						<span>New</span>
					</div>
				</div> :
				null
			}

		</div>
	)
}

const DisplayOptions = ({displayOptionsOpen, openDisplayOptions}) => {
	return(
		<div id='displayOptions' onClick={() => openDisplayOptions(!displayOptionsOpen)}>
			<div> 
				<i class="fas fa-caret-down"></i>
				<i class="fas fa-square"></i>
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

const Feed = ({userLoggedIn}) => {

	const [sortOptionsOpen, openSortOptions] = useState(false)
	const [displayOptionsOpen, openDisplayOptions] = useState(false)


	return(
		<div id='feed'>
			<SortOptions sortOptionsOpen={sortOptionsOpen} openSortOptions={openSortOptions}/>
			<DisplayOptions displayOptionsOpen={displayOptionsOpen} openDisplayOptions={openDisplayOptions}/>
			<Post userLoggedIn={userLoggedIn}/>
		</div>
	)
}

export default Feed