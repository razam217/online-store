import React from 'react';
import {Switch, Route} from 'react-router-dom';
import {NavLink, useParams} from "react-router-dom";
import {url, generateRequiredHeaders, getMenu, getStoreInfo, locateStore} from '../api/apiService'
import {Card, Container, Nav, Navbar, Row} from 'react-bootstrap';
import logo from "../assets/logo3.png";
import cart from "../assets/cart.png";
import MenuPage from "./MenuComponent";

class CategoriesPage extends React.Component {


	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			storeID: "",
			storeCredentials: {},
			// headers: {},
			storeInfo: {},
			menu: []
		}
	}

	async componentDidMount() {
		let storeID = this.props.match.params.storeID
		let storeCredentials = await locateStore(storeID)
		let storeInfo = await getStoreInfo(storeCredentials)
		let menu = {}
		if (storeInfo && storeInfo.storeInfos) {
			menu = await getMenu(storeCredentials, {store_id: storeInfo.storeInfos[0].store_id})
		}

		this.setState({
			storeID: storeID,
			storeCredentials: storeCredentials,
			// headers: headers,
			storeInfo: storeInfo,
			menu: menu && menu.menu ? menu.menu : null,
			cartCounter: 0
		})
		console.log(this.state)
		// getMenu().then((s) => console.log(s))
	}


	render () {
		if (this.state && this.state.storeInfo.storeInfos) {
			let store = this.state.storeInfo.storeInfos[0]
			return (



				<Container>

					<Row className='menu-list padding-10'>
						{this.state.menu && this.state.menu.length > 0 && this.state.menu.map((menuItem, index) => {
							return (
								<Card style={{width: '18rem', height: '22rem'}} className="margin-10" key={index}>
									<Card.Img className='card-img' variant="top" src={menuItem.cat_pic}/>
									<Card.Body>
										<Card.Title className="text-centered">{JSON.parse(menuItem.cat_name).en}</Card.Title>
										{/*<Card.Text className="text-centered">*/}
										{/*	{category.desc}*/}
										{/*</Card.Text>*/}
									</Card.Body>
								</Card>
							)
						})}


					</Row>
				</Container>
			)
		} else {
			return false
		}
	}
}

export default CategoriesPage;
