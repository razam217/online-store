import React, {useState, useEffect} from "react"
import {Form, Modal, Button, ListGroup, Row} from "react-bootstrap"


function CheckoutModal(props) {

	let {products} = props
	let [newProducts, setNewProducts] = useState({})
	let [totalPrice, setTotalPrice] = useState(0)



	useEffect(() => {
		normalizeProductsList()
		calculateTotal(products)
	}, [products])

	function calculateTotal (prods) {
		let total = 0
		for (let i = 0; i< prods.length; i++) {
			total += parseFloat(prods[i].price)
		}
		setTotalPrice(total)
	}

	function normalizeProductsList () {
		let tempNP = {}
		for (let p in products) {
			let prod = products[p]
			if (tempNP[prod.product_id]) {
				tempNP[prod.product_id].counter ++
			} else {
				tempNP[prod.product_id] = {
					counter: 1,
					object: prod
				}
			}
		}
		setNewProducts(tempNP)
	}


	function incrementItemCounter (item) {
		let np = JSON.parse(JSON.stringify(newProducts))
		np[item.product_id].counter ++
		setNewProducts(np)

		let cartDetails = JSON.parse(window.localStorage.getItem("cartDetails"))
		cartDetails.cartCounter++
		cartDetails.items.push(item)
		window.localStorage.setItem("cartDetails", JSON.stringify(cartDetails))
		props.refreshCart()
	}

	function decrementItemCounter (item) {
		newProducts[item.product_id].counter --

		let cartDetails = JSON.parse(window.localStorage.getItem("cartDetails"))
		cartDetails.cartCounter--

		cartDetails.items.push(item)
		props.refreshCart()
	}

	console.log(newProducts)
	return (
		<Modal
			{...props}
			size="xl"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Your Cart
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>

				<Row className='menu-list padding-10'>
					<ListGroup className="list-prods">
						{newProducts && Object.keys(newProducts) && Object.keys(newProducts).length > 0 && Object.keys(newProducts).map((key, index) => {
							let prod = newProducts[key]
							return (

								<ListGroup.Item key={index}>
									<div className="item-section-left">
										<div className="list-item-img">
											<img className="item-img" src={prod.object.product_pic} />
										</div>
										<div className="txt-desc">
											<h5>{JSON.parse(prod.object.product_name).en}</h5>
											<p>{prod.object.note}</p>
										</div>
									</div>
									<div className="list-right-area">
										<span className="price-tag">${prod.object.price}</span>
										<div className="add-rem-comp">
											<Button className="rem-btn" onClick={decrementItemCounter.bind(this, prod.object)}> - </Button>
											<Form.Control className="cart-item-input" type="text" value={prod.counter} readOnly/>
											<Button className="add-btn" onClick={incrementItemCounter.bind(this, prod.object)}> + </Button>
										</div>
										{/*<Button variant="outline-primary" onClick={addItemToCart.bind(this, prod)}>+ Add</Button>*/}
									</div>
								</ListGroup.Item>
							)
						})}
					</ListGroup>
				</Row>

				<Row className="total-sect">
					<h5>Total: </h5>
					<h5>${totalPrice}</h5>
				</Row>

			</Modal.Body>
			<Modal.Footer>
				<Button block>Checkout</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default CheckoutModal
