import React, { useState, useEffect } from 'react'
import './_post.sass'

const PostInfo = ({postInfoIsOpen, openPostInfo, userLoggedIn, openEnlargedWindow}) => {
	return(
		<div className='container postInfo'>
			<img src='https://robohash.org/4' alt="Community img"/>
			<span> Community name</span>
			{
				userLoggedIn ?
				<span class='joinCommunity'> Join </span> :
				null
			}
			<span> 5hrs </span>
			<span> /u/Users name </span>
			<i onClick={() => {
				openPostInfo(!postInfoIsOpen)
				openEnlargedWindow(false)
			}}className="fas fa-bars"></i>
		</div>
	)
}


const PostContent = ({enlargedImgOpen, openEnlargedWindow}) => {
	return(
		<div className='container postContent'>
			<p> orem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem orem lorem lorem lorem lorem lorem lorem lorem lorem  </p>
			<img onClick={() => {
				openEnlargedWindow(!enlargedImgOpen)
			}} src='https://robohash.org/3' alt='Post image' />
		</div> 
	)
}

const PostMenu = () => {
	return(
		<div className='container postMenu'>
			<div>
				<i className="fas fa-bars"></i>
				<span> Share </span>
			</div>
			<div>
				<i className="fas fa-bars"></i>
				<span> User name's profile </span>
			</div>
			<div>
				<i className="fas fa-bars"></i>
				<span> Save</span>
			</div>
			<div>
				<i className="fas fa-bars"></i>
				<span> Report</span>
			</div>
		</div>
	)
}

const EnlargedPostImg = () => {
	return(
		<div className='container enlargedPostImg'>
			<img src='https://robohash.org/3' alt='Enlarged post image'/>
		</div>
	)
}



const InteractionWindow =() => {
	return(
		<div className='container' id='interactionWindow'>
			<div className='container'>
				<i class="fas fa-arrow-circle-up"></i>
				<span> 24.7k</span>
				<i class="fas fa-arrow-circle-down"></i>
			</div>
			<div className='container'>
				<span> 100</span>
				<i class="far fa-comment-dots"></i>
			</div>
		</div>
	)
}

const PostMeta= ({windowWidth}) => {

	const [reactionIsOpen, openReactions] = useState(false)

	const ReactionsDisplay = ({reactionIsOpen, openReactions}) => {

		return(
			<div id='reactionsDisplay' className='container'>
				<div>
					<i onClick={() => openReactions(!reactionIsOpen)} class="far fa-meh"></i>
				</div>
				<div>
					<i class="far fa-smile-beam"></i>
					<span>0 </span>
				</div>
				<div>
					<i class="far fa-laugh-squint"></i>	
					<span>0 </span>		
				</div>
			</div>
		)
	}

	const ReactionsWindow = ({reactionIsOpen, openReactions}) => {
		return(
			<div id='reactionsWindow' className='container'>
				<div>
					<i onClick={() => openReactions(!reactionIsOpen)} class="fas fa-times"></i>
				</div>
				<div>
					<i class="far fa-smile-beam"></i>
					<span>0 </span>
				</div>
				<div>
					<i class="far fa-laugh-squint"></i>	
					<span>0 </span>		
				</div>
				<div>
					<i class="far fa-sad-tear"></i>
					<span>0 </span>			
				</div>	
				<div>
					<i class="far fa-surprise"></i>	
					<span>0 </span>		
				</div>	
				<div>
					<i class="far fa-grimace"></i>
					<span>0 </span>		
				</div>
				</div>
		)
	}

	return(
		<div className='container' id='postMeta'>
		{
			reactionIsOpen ?
			<ReactionsWindow reactionIsOpen={reactionIsOpen} openReactions={openReactions}  />:
			<ReactionsDisplay reactionIsOpen={reactionIsOpen} openReactions={openReactions} />
		}
		{
			reactionIsOpen === false && windowWidth <= 920 ?
			<InteractionWindow /> :
			null
		}


		</div>
	)
}

const Post = ({userLoggedIn, windowWidth}) => {

	const [postInfoIsOpen, openPostInfo] = useState(false)
	const [enlargedImgOpen, openEnlargedWindow] = useState(false)

	return(
		<div className='post'>
			<PostInfo postInfoIsOpen={postInfoIsOpen} openPostInfo={openPostInfo} userLoggedIn={userLoggedIn} openEnlargedWindow={openEnlargedWindow}/>
			{
				postInfoIsOpen ?
				<PostMenu/> :
				<React.Fragment>
					<PostContent enlargedImgOpen={enlargedImgOpen} openEnlargedWindow={openEnlargedWindow}/> 
					<PostMeta  windowWidth={windowWidth}/>
				</React.Fragment>
			}
			{
				enlargedImgOpen ?
				<EnlargedPostImg /> :
				null
			}
		{
			windowWidth > 920 ?
			<InteractionWindow /> :
			null
		}
		</div>
	)
}

export default Post