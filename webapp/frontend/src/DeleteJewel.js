import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import './App.css';

const DeleteJewel = (props) => {

    const [jewelId, setJewelId] = useState("");

    const handleDelete = (event) => {
        setJewelId(event.target.value);
        axios.delete(`localhost:8080/api/jewels/${jewelId}`)
            .then(response => response.data)
            .catch(error => console.log(error))

        event.preventDefault();
    };

    return (
        <>
            <div className="Div-element">
                <form>
                    <input type='text' value={jewelId} onChange={event => setJewelId(event.target.value)}/><br/>
                    <input type='submit' value='Delete product' onClick={handleDelete}/>
                </form>
            </div>
        </>
    );
};

export default DeleteJewel;