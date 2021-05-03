import React from "react";
import {useParams} from "react-router-dom"

const MenuPage = (props) => {

	let {storeID} = useParams()
	console.log(storeID)

	console.log(props)
	return(
		<div>
			<h2>About</h2>
			<p>This app uses React, Redux, React Router, and many other helpful libraries.</p>
		</div>
	)
}

export default MenuPage;
