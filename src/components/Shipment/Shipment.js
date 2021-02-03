import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../App';
import './Shipment.css';

const Shipment = () => {
    const { register, handleSubmit, watch, errors } = useForm();
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const {name, email} = loggedInUser;
    const onSubmit = data => console.log(data);

    console.log(watch("example")); 

    return (
        <form className="ship-form" onSubmit={handleSubmit(onSubmit)} >

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
    );
};

export default Shipment;