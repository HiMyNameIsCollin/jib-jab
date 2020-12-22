import React from 'react'
import CommunityListWidget from './widgets/CommunityListWidget'
import TopPostListWidget from './widgets/TopPostListWidget'
import RulesListWidget from './widgets/RulesListWidget'
import LinkListWidget from './widgets/LinkListWidget'
import ModeratorListWidget from './widgets/ModeratorListWidget'
import AboutCommunityWidget from './widgets/AboutCommunityWidget'
import AppendixWidget from './widgets/AppendixWidget'
import InteractionWidget from './widgets/InteractionWidget'
import AnnouncementWidget from './widgets/AnnouncementWidget'
import './_widgetContainer.sass'
const WidgetContainer = ({pageType, Link, pageContent, user, setUser, setMessage, setOverlay, url}) => {


/*###########################TYPE OF MENU#######################################*/

const FrontPageWidgets = () => {
	return(
		<React.Fragment>
			<CommunityListWidget Link={Link} pageContent={pageContent} widgetContent={pageContent.configuration.widgets.communityListWidget} pageType={pageType} user={user} url={url} />
			<AppendixWidget Link={Link}/>				
		</React.Fragment>
	)
} 

const CommunityWidgets = ({pageContent}) => {
	return(
		<React.Fragment>
		{
			pageContent.configuration.widgets.aboutWidget.active === 'true' ? 
			<AboutCommunityWidget widgetContent={pageContent.configuration.widgets.aboutWidget} pageContent={pageContent}/>  :
			null
		}
		{
			pageContent.configuration.widgets.announcementWidget.active === 'true' ?
			<AnnouncementWidget widgetContent={pageContent.configuration.widgets.announcementWidget}/> :
			null
		}
		{
			pageContent.configuration.widgets.communityListWidget.active === 'true' ? 
			<CommunityListWidget 
			Link={Link} 
			pageType={pageType} 
			user={user} 
			widgetContent={pageContent.configuration.widgets.communityListWidget}
			pageContent={pageContent}
			url={url} />  :
			null
		}
		{
			pageContent.configuration.widgets.rulesWidget.active === 'true' ?
			<RulesListWidget widgetContent={pageContent.configuration.widgets.rulesWidget}/> :
			null
		}
		{
			pageContent.configuration.widgets.linkListWidget.active === 'true' ?
			<LinkListWidget widgetContent={pageContent.configuration.widgets.linkListWidget}/> :
			null
		}
		{
			pageContent.communityName === 'Global' ?
			<React.Fragment>
				<TopPostListWidget pageContent={pageContent} Link={Link} url={url} />
				<AppendixWidget Link={Link}/>
			</React.Fragment> :
			<React.Fragment>
				<TopPostListWidget pageContent={pageContent} Link={Link} url={url} />
				<ModeratorListWidget pageContent={pageContent} Link={Link} /> 
				<AppendixWidget Link={Link}/>	
			</React.Fragment>
		}

		</React.Fragment>
	)
}

const ProfileWidgets = () => {
	return(
		<React.Fragment>
			<InteractionWidget 
				user={user} 
				pageContent={pageContent} 
				setMessage={setMessage} 
				setOverlay={setOverlay}
				setUser={setUser}/>
			<AppendixWidget Link={Link}/>	
		</React.Fragment>
	)
}




	return(
		<div className={ pageContent ? pageContent.communityNameLower === 'global'|| pageType === 'postPage' || pageType === 'userPostPage' ? 'widgetContainerGlobalPage container widgetContainer' : 'container widgetContainer' : 'container widgetContainer'}>
			<div className={pageType === 'frontPage' ? 'widgetSizingContainerFrontPage widgetSizingContainer' : 'widgetSizingContainer'}>
			{
				pageType === 'frontPage' ?
				<FrontPageWidgets  /> :
				pageType === 'profilePage' || pageType === 'userPostPage'  ?
				<ProfileWidgets /> :
				pageType === 'communityPage' ||  pageType === 'postPage'?
				<CommunityWidgets pageContent={pageContent} /> : 
				null
			}
			</div>
		</div>
	)
}

export default WidgetContainer

