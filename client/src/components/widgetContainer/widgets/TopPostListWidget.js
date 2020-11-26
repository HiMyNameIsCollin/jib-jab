import React, {useState, useEffect} from 'react'

	const TopPostListWidgetItem = ({post}) => {
		return(
			<li className='topPostListWidgetItem'>
				<span> {post.title} </span> 
				<span>{post.comments.length} comments</span>
				 <span> {post.karma.upvotes.length - post.karma.downvotes.length} upvotes</span>
			</li>
		)
	}

const TopPostListWidget = ({pageContent}) => {

	const [topPosts, setTopPosts] = useState(undefined)

		useEffect(() => {
			fetch(`http://localhost:3000/api/topPosts/${pageContent.communityNameLower}`)
			.then(response => response.json())
			.then(response => setTopPosts(response))
			.catch(err => console.log(err))
		},[])
	return(
		<div className='topPostListWidget'>
			<h4> Most viewed posts in 24 hours </h4>
			<ul>	
				{
					topPosts !== undefined ?
					topPosts.map((p, i) => {
						return <TopPostListWidgetItem post={p}/>
					}) : 
					null
				}
			</ul>
				<a className='widgetButton' href=""> View more </a>
		</div>	
	)
}

export default TopPostListWidget