import React, {useEffect, useState, useCallback} from 'react'
import usePromiseEffect from '../common/PromiseEffect'
import {useParams} from "react-router-dom";
import {url, generateRequiredHeaders, getMenu, getStoreInfo, locateStore, getProductsByStore} from '../api/apiService'
import {Alert, Button, Card, Container, Nav, Navbar, Row, ListGroup} from 'react-bootstrap';
import logo from "../assets/logo3.png";
import cart from "../assets/cart.png";
import MenuPage from "./MenuComponent";

const CategoriesPage = (props) => {
	let {storeID} = useParams()
	let [storeCredentials, setStoreCredentials] = useState({})
	let [storeInfo, setStoreInfo] = useState({})
	let [menu, setMenu] = useState({})
	let [products, setProducts] = useState([])
	let [activeMenuID, setActiveMenuID] = useState("")
	let [showSuccess, setShowSuccess] = useState(false)
	let [subCategories, setSubCategories] = useState([])
	let [activeSubCategoryID, setActiveSubCategoryID] = useState("")


	async function fetchData () {
		let sc = await locateStore(storeID)
		setStoreCredentials(sc)
		let si = await getStoreInfo(sc)
		if (si && si.storeInfos && si.storeInfos.length > 0) {
			props.getStoreInfo(si.storeInfos[0])
		}
		setStoreInfo(si)

		if (si && si.storeInfos) {
			var m = await getMenu(sc, {store_id: si.storeInfos[0].store_id})
			var p = await getProductsByStore(sc, {store_id: si.storeInfos[0].store_id})
			setMenu(m)
			setProducts(p.products)
		}
	}


	function fetchingItemsList (menuItem, isSubCategory) {

		if (isSubCategory) {
			setActiveSubCategoryID(menuItem.id)
		} else {
			if (menuItem && menuItem.child && menuItem.child.length > 0) {
				setSubCategories(menuItem.child)
			} else {
				setSubCategories([])
			}
			setActiveSubCategoryID("")
			setActiveMenuID(menuItem.id)
		}

	}

	function addItemToCart (item) {
		let cartDetails = JSON.parse(localStorage.getItem('cartDetails'))
		if (!cartDetails.items) {
			cartDetails.items = []
		}
		cartDetails.items.push(item)
		cartDetails.cartCounter++
		localStorage.setItem('cartDetails', JSON.stringify(cartDetails))
		props.refreshCart()
		setShowSuccess(true)
		setTimeout(()=> {
			setShowSuccess(false)
		}, 4000)
	}

	usePromiseEffect(async () => {
		fetchData()
		props.refreshCart()
	}, []);

	return (
		<Container>

			{
				(!storeCredentials || (!storeCredentials.appSecret && !storeCredentials.appKey)) &&
				<Row>
					<Alert variant="danger" style={{width: "100%"}}>
						<Alert.Heading>Store Not Found!</Alert.Heading>
						<p>
							The ID you specified doesn't seem to be a valid store ID.
						</p>
					</Alert>
				</Row>

			}

			{
				showSuccess ?
					<Alert variant="success" className="fixed-top" style={{height: "60px", textAlign: "center"}}>
						Item successfully added to cart.
					</Alert>
					: ""
			}

			{menu && menu.menu && menu.menu.length > 0 && <h3>Categories</h3>}

			<Row className='menu-list'>
				{menu && menu.menu && menu.menu.length > 0 && menu.menu.map((menuItem, index) => {
					return (
						<Card style={{width: '9rem', height: '11rem'}} className={`margin-10 ${activeMenuID == menuItem.id ? "active" : ""}`} key={index} onClick={fetchingItemsList.bind(this, menuItem, false)}>
							<Card.Img className='card-img' variant="top" src={menuItem.cat_pic}/>
							<Card.Title className="text-centered">{JSON.parse(menuItem.cat_name).en}</Card.Title>
						</Card>
					)
				})}
			</Row>

			{subCategories && subCategories.length > 0 && <h3>Sub Categories</h3>}

			<Row className='menu-list'>
				{subCategories && subCategories.length > 0 && subCategories.map((sc, index) => {
					return (
						<Card style={{width: '9rem', height: '11rem'}} className={`margin-10 ${activeSubCategoryID == sc.id ? "active" : ""}`} key={index} onClick={fetchingItemsList.bind(this, sc, true)}>
							<Card.Img className='card-img' variant="top" src={sc.cat_pic}/>
							<Card.Title className="text-centered">{JSON.parse(sc.cat_name).en}</Card.Title>
						</Card>
					)
				})}
			</Row>


			<Row className='menu-list padding-10'>

					{products && products.map((prod, index) => {
						if (prod.cate_id == activeMenuID || prod.cate_id == activeSubCategoryID) {
							return (
								<ListGroup className="list-prods" key={index}>
									<ListGroup.Item>
										<div className="item-section-left">
											<div className="list-item-img">
												<img className="item-img" src={prod.product_pic} />
											</div>
											<div className="txt-desc">
												<h5>{JSON.parse(prod.product_name).en}</h5>
												<p>{prod.note}</p>
											</div>
										</div>
										<div className="list-right-area">
											<span className="price-tag">${prod.price}</span>
											<Button variant="outline-primary" onClick={addItemToCart.bind(this, prod)}>+ Add</Button>
										</div>
									</ListGroup.Item>
								</ListGroup>
							)
						}
					})}
			</Row>

		</Container>
	)
}

export default CategoriesPage;
