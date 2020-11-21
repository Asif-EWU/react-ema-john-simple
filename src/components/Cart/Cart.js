import React from 'react';
import { Link } from 'react-router-dom';

const Cart = (props) => {
    const formatNumber = num => Number(num.toFixed(2));
    
    const cart = props.cart;
    // const totalPrice = cart.reduce((total, product) => total + product.price, 0);
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        const product = cart[i];
        totalPrice += product.price * product.quantity;
    }

    totalPrice = formatNumber(totalPrice);

    let shipping;
    if(totalPrice === 0 || totalPrice >= 35) shipping = 0;
    else if(totalPrice >= 15) shipping = 4.99;
    else shipping = 12.99;

    const tax = formatNumber(totalPrice / 10);
    const grandTotal = formatNumber(totalPrice + shipping + tax);


    return (
        <div>
            <h4>Order Summary</h4>
            <p>Items ordered: {cart.length}</p>
            <p>Product Price: {totalPrice}</p>
            <p><small>Shipping cost: {shipping}</small></p>
            <p><small>Tax + VAT: {tax}</small></p>
            <p>Total Price: {grandTotal}</p>
            <br/>
            <Link to="/review"><button className="main-button">Review Order</button></Link>
        </div>
    );
};

export default Cart;