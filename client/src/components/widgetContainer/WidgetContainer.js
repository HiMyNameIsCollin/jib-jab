import React, {useState, useEffect} from 'react'
import CommunityListWidget from './widgets/CommunityListWidget'
import TopPostListWidget from './widgets/TopPostListWidget'
import RulesListWidget from './widgets/RulesListWidget'
import LinkListWidget from './widgets/LinkListWidget'
import ModeratorListWidget from './widgets/ModeratorListWidget'
import AboutCommunityWidget from './widgets/AboutCommunityWidget'
import AppendixWidget from './widgets/AppendixWidget'
import InteractionWidget from './widgets/InteractionWidget'
import AnnouncementWithLinkWidget from './widgets/AnnouncementWithLinkWidget'
import './_widgetContainer.sass'
const WidgetContainer = ({pageType, Link, pageContent, user}) => {


/*###########################TYPE OF MENU#######################################*/

const FrontPageWidgets = () => {
	return(
		<React.Fragment>
			<CommunityListWidget Link={Link} pageContent={pageContent} pageType={pageType} user={user}/>
			<TopPostListWidget />
			<AppendixWidget Link={Link}/>				
		</React.Fragment>
	)
}

const GlobalPageWidgets = () => {
	return(
		<React.Fragment>
			<CommunityListWidget Link={Link} pageContent={pageContent} pageType={pageType} user={user}/>
			<TopPostListWidget />
			<AppendixWidget />	
		</React.Fragment> 
	)
}

const CommunityWidgets = () => {
	return(
		<React.Fragment>
		{
			pageContent.configuration.widgets.aboutWidget.active ? 
			<AboutCommunityWidget pageContent={pageContent}/> :
			null
		}
		{
			pageContent.configuration.widgets.communityListWidget.active ? 
			<CommunityListWidget Link={Link} pageContent={pageContent} pageType={pageType} user={user} /> :
			null
		}
		{
			pageContent.configuration.widgets.announcementWidget.active ?
			<AnnouncementWithLinkWidget Link={Link} /> :
			null			
		}
		{
			pageContent.configuration.widgets.rulesWidget.active ?
			<RulesListWidget /> :
			null
		}
		{
			pageContent.configuration.widgets.linkListWidget.active ?
			<LinkListWidget /> :
			null
		}
			<TopPostListWidget />
			<ModeratorListWidget /> 
			<AppendixWidget Link={Link}/>	
		</React.Fragment>
	)
}

const ProfileWidgets = () => {
	return(
		<React.Fragment>
			<InteractionWidget pageContent={pageContent}/>
			<AppendixWidget Link={Link}/>	
		</React.Fragment>
	)
}




	return(
		<div className={ pageContent ? pageContent.communityNameLower === 'global'|| pageType === 'postPage' || pageType === 'userPostPage' ? 'widgetContainerGlobalPage container widgetContainer' : 'container widgetContainer' : 'container widgetContainer'}>
			<div className={pageType === 'frontPage' ? 'widgetSizingContainerFrontPage widgetSizingContainer' : 'widgetSizingContainer'}>
			{
				pageType === 'frontPage' || 'userPostPage' ?
				<FrontPageWidgets  /> :
				pageType === 'profilePage' ?
				<ProfileWidgets /> :
				pageType === 'communityPage' ?
				<CommunityWidgets /> : 
				pageType === 'globalPage' ?
				<GlobalPageWidgets /> :
				pageType === 'postPage' ?
				<CommunityWidgets /> :
				null
			}
			</div>
		</div>
	)
}

export default WidgetContainer

