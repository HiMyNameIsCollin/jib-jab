import React, {useState, useEffect} from 'react'


const TopPostListWidget = ({pageContent, Link}) => {

	const TopPostListWidgetItem = ({post}) => {
		return(
			<li className='topPostListWidgetItem'>
			<Link className='link' to={`/c/${post.communityName}/${post.id}`}>
				<span> {post.title} </span> 
				<span>{post.comments.length} comments</span>
				<span> {post.karma.upvotes.length - post.karma.downvotes.length} upvotes</span>
			</Link>
			</li>
		)
	}




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
					topPosts !== undefined && topPosts.length !== 0?
					topPosts.map((p, i) => {
						return <TopPostListWidgetItem post={p} key={i}/>
					}) : 
					<p> There has been no posts in {pageContent.communityName} today :( </p>
				}
			</ul>
		</div>	
	)
}

export default TopPostListWidget