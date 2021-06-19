import React from 'react';
import axios from 'axios';
import {useState} from "react";
import './App.css';

const AddJewel = (props) => {

    const [jewelName, setJewelName] = useState("");

    const handleSubmit = (event) => {
        axios.post('/api/jewel', {
            jewel: jewelName
        })
            .then(response => console.log(response))
            .catch(error => console.log(error));

        event.preventDefault();
    };


    return (
        <>
            <div className="Div-element">
                <input type='text' value={jewelName} onChange={event => setJewelName(event.target.value)}/><br/>
                <input type='submit' value='Add product' onClick={handleSubmit}/>
            </div>
        </>
    );
};

export default AddJewel;