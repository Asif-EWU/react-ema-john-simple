import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';
import './ProductDetail.css';
import FadingWheel from '../../images/FadingWheel.gif'

const ProductDetail = () => {
    const {productKey} = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});

    useEffect(() => {
        fetch('https://stark-island-05079.herokuapp.com/product/' + productKey)
        .then(res => res.json())
        .then(data => {
            setProduct(data);
            setLoading(false);
        });
    }, [productKey]);

    return (
        <div>
            { 
                loading && 
                <img style={{"display": "block", "margin": "150px auto"}} src={FadingWheel} alt=""/>
            }
            <Product 
                product={product}
                addToCart={false}    
            ></Product>
        </div>
    );
};

export default ProductDetail;