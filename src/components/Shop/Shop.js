import React, { useEffect, useState } from 'react';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css'
import FadingWheel from '../../images/FadingWheel.gif'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('https://stark-island-05079.herokuapp.com/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    useEffect(() => {
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        
        fetch('https://stark-island-05079.herokuapp.com/productByKeys', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => {
            data.forEach(pd => pd.quantity = savedCart[pd.key]);
            setCart(data);
        });        
    }, []);

    const handleAddProduct = (product) => {
        const toBeAddedKey = product.key;
        const sameProduct = cart.find(pd => pd.key === toBeAddedKey);
        let count = 1;
        let newCart;

        if(sameProduct) {
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== toBeAddedKey);
            newCart = [...others, sameProduct];
        }
        else {
            product.quantity = count;
            newCart = [...cart, product];
        }
        
        setCart(newCart);
        addToDatabaseCart(product.key, count);
    }

    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    products.length === 0 && 
                    <img style={{"display": "block", "margin": "150px auto"}} src={FadingWheel} alt=""/>
                }
                {
                    products.map(product => <Product
                            key={product.key} 
                            product={product}
                            handleAddProduct={handleAddProduct}
                            addToCart={true}
                        ></Product>
                    )
                }
            </div>
            
            <div className="cart-container">
                <div className="cart">
                    <Cart cart={cart}>
                        <Link to="/review"><button className="main-button">Review Order</button></Link>
                    </Cart>
                </div>
            </div>
        </div>
    );
};

export default Shop;