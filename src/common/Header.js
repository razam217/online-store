import React, {useEffect} from 'react';
import {NavLink, useParams} from 'react-router-dom';
import {Nav, Navbar} from "react-bootstrap";
import logo from "../assets/logo3.png";
import {generateRequiredHeaders, getStoreInfo, locateStore} from "../api/apiService";

const Header = (props) => {
	let {storeID} = useParams()
	console.log(storeID, this)

	const activeStyle = {
		color: "#ffffff",
		opacity: 1,
		fontWeight: "bold"
	};



	return (


		<Navbar bg="dark" expand="lg">

			<div className="header">
				<img className="header-logo" src={logo} alt=""/>
				<a className="navbar-brand" href="/locate/" >{storeID}</a>
			</div>

			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto nav-main">
					<NavLink to="/" activeStyle={activeStyle} exact>Categories</NavLink>
					<NavLink to="/about" activeStyle={activeStyle} exact>About</NavLink>
				</Nav>

			</Navbar.Collapse>
		</Navbar>

	)
}


export default Header;
