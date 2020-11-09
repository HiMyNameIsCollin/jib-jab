import React, { useState } from 'react'

const RulesListWidget = () => {

	const RulesListWidgetItem = () => {

		const [ruleIsOpen, setRuleOpen] = useState(false)

		return(
			<React.Fragment>
				<li onClick ={() => setRuleOpen(!ruleIsOpen)}>
					<span>1.</span> <span> Rules synopsis blah blah blah blah blah blah</span>  <i class="fas fa-caret-down"></i>
				</li>
				{
					ruleIsOpen === true ?
					<div>
						<p> Rules to be enforced blah blah blah </p>
					</div> :
					null
				}
			</React.Fragment>
		)
	}

	return(
		<div className='rulesListWidget'>
			<h4>Community Rules </h4>
			<ul> 
				<RulesListWidgetItem />
				<RulesListWidgetItem />
			</ul>
		</div> 
	)
}

export default RulesListWidget