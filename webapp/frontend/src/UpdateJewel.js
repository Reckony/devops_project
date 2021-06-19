import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import './App.css';

const UpdateJewel = (props) => {

    const [jewelId, setJewelId] = useState("");
    const [jewelName, setJewelName] = useState("");
    const [jewelPrice, setPrice] = useState("");

    const handleUpdate = (event) => {
        setJewelId(event.target.value);
        axios.put(`/api/jewels/${jewelId}`, {
            name: jewelName,
            price: jewelPrice
        })
            .then(response => response.data)
            .catch(error => console.log(error))

        event.preventDefault();
    };

    return (
        <>
            <div className='Div-element'>
                <form>
                    ID: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' value={jewelId} onChange={event => setJewelId(event.target.value)}/><br/>
                    Name: <input type='text' value={jewelName} onChange={event => setJewelName(event.target.value)}/><br/>
                    Price: <input type='text' value={jewelPrice} onChange={event => setPrice(event.target.value)}/><br/>
                    <input type='submit' value='Update product' onClick={handleUpdate}/>
                </form>
            </div>
        </>
    );
}

export default UpdateJewel;