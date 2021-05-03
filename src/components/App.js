import {Switch, Route} from 'react-router-dom';
import {Container, Navbar} from 'react-bootstrap'
import '../styles/App.css';

import {useParams} from 'react-router-dom';
import CategoriesPage from "./CategoriesComponent1"
import MenuPage from "./MenuComponent"
import CheckoutModal from '../common/CheckoutModal'
import React, {useEffect, useState} from "react";
import {generateRequiredHeaders, getStoreInfo, locateStore} from "../api/apiService";
import logo from "../assets/logo3.png";
import cart from "../assets/cart.png";

function App() {

    let [store, setStoreInfo] = useState({})
    let [cartDetails, setCartDetails] = useState({})
    let [modalShow, setModalShow] = useState(false)


    useEffect(() => {
        getLatestCartInfoAndRender()
    }, [])

    function getLatestCartInfoAndRender () {
        let cartDetails = localStorage.getItem("cartDetails")
        if (cartDetails) {
            setCartDetails(JSON.parse(cartDetails))
            return
        }
        let cd = {
            cartCounter: 0,
            items: []
        }
        localStorage.setItem("cartDetails", JSON.stringify(cd))
    }

    return (
        <div className="App">
            {cartDetails && cartDetails.items &&

                <CheckoutModal
                    refreshCart={getLatestCartInfoAndRender}
                    products={cartDetails.items}
                    show={modalShow}
                    onHide={() => setModalShow(false)}/>
            }

          <header className="App-header">

            <Container>
              {/*<Header/>*/}

                <Navbar bg="dark" expand="lg">

                    <div className="header">
                        <div className="img-left">
                            <img className="header-logo" src={logo} alt=""/>
                        </div>
                        <div className="text-right">
                            <h3>{store && store.store_name && JSON.parse(store.store_name).en}</h3>
                            <p>{store && store.street && store.street} {store && store.store_addr && store.store_addr}</p>
                        </div>
                    </div>

                    <div className="cart" onClick={() => setModalShow(true)}>
                        <img className="cart-icon" src={cart} alt="" />
                        <span className="cart-counter">{cartDetails && cartDetails.cartCounter}</span>
                    </div>

                </Navbar>

              <Switch>
                <Route exact path="/locate/:storeID">
                    <CategoriesPage refreshCart={getLatestCartInfoAndRender}

                        getStoreInfo={ storeinfo => setStoreInfo(storeinfo) }
                                    setCartDetails={ cartDetails => setCartDetails(cartDetails)}
                                    />
                </Route>
                <Route exact path="/locate/:storeID/category/:categoryID" component={MenuPage} />
              </Switch>

            </Container>

          </header>
        </div>
    );
}

export default App;
