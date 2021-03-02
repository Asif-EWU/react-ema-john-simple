import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';
import { getDatabaseCart, processOrder } from '../../utilities/databaseManager';
import './Shipment.css';
import happyImage from '../../images/giphy.gif';

const Shipment = () => {
    const { register, handleSubmit, errors } = useForm();
    const [loggedInUser] = useContext(UserContext);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const {name, email} = loggedInUser;
    const onSubmit = data => {
        const savedCart = getDatabaseCart();
        const orderDetails = {...loggedInUser, products: savedCart, shipment: data, orderTime: new Date()};

        fetch('https://stark-island-05079.herokuapp.com/addOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(orderDetails)
        })
        .then(res => res.json())
        .then(data => {
            if(data){
                processOrder();
                setOrderPlaced(true);
            }
        })
    };

    return (
        <>
        {
          orderPlaced 
          ? <img style={{"display": "block", "margin": "auto"}} src={happyImage} alt=""/>
          
          : <form className="ship-form" onSubmit={handleSubmit(onSubmit)} >

                <input name="name" defaultValue={name} ref={register({ required: true })} placeholder="Your Name" />
                { errors.name && <span className="error">Name is required</span>}

                <input name="email" defaultValue={email} ref={register({ required: true })} placeholder="Your email" />
                { errors.email && <span className="error">Email is required</span>}

                <input name="address" ref={register({ required: true })} placeholder="Your address" />
                { errors.address && <span className="error">Address is required</span>}

                <input name="phone" ref={register({ required: true })} placeholder="Your phone" />
                { errors.phone && <span className="error">Phone is required</span>}

                <input type="submit" />
            </form >
        }
        </>
    );
};

export default Shipment;