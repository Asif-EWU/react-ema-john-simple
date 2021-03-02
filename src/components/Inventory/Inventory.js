import React from 'react';
import fakeData from '../../fakeData';
import './Inventory.css';

const Inventory = () => {
    const handleAddProduct = () => {
        fetch('https://stark-island-05079.herokuapp.com/addProduct', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fakeData)
        })
    }

    return (
        <div>
            <button onClick={handleAddProduct}>Add Product</button>
        </div>
    );
};

export default Inventory;