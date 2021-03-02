import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Product/Product';
import './ProductDetail.css';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        fetch('https://stark-island-05079.herokuapp.com/product/' + productKey)
        .then(res => res.json())
        .then(data => setProduct(data));
    }, [productKey]);

    return (
        <div>
            <Product 
                product={product}
                addToCart={false}    
            ></Product>
        </div>
    );
};

export default ProductDetail;