import React from 'react';
import axios from 'axios';
import {useState} from 'react';
import './App.css';

const ShowJewels = (props) => {

    const [jewels, setJewels] = useState([]);
    const [jewelId, setJewelId] = useState({});


    const handleShowAll = (event) => {
        axios.get('/api/jewels')
            .then(response => setJewels(response.data))
            .catch(error => console.log(error));

        event.preventDefault();
    };

    const handleShow = (event) => {
        setJewelId(event.target.value);
        axios.get(`/api/jewels/${jewelId}`
        )
            .then(response => response.data)
            .catch(error => console.log(error));

        event.preventDefault();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleShow(event)
        }
    }

    return (
        <>
        <div className="Div-element">
                <form>
                    <button onClick={handleShowAll}>Show all</button>
                    <button onClick={handleShowAll}><i className="fa fa-refresh"/></button>
                    <br/>
                    {jewels
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(jewel => (<div key={jewel.id}>Name: {jewel.name} | Price: {jewel.price} | ID: {jewel.id}</div>))
                    }
                </form>
            </div>

            <div className="Div-element">
                <form>
                    <input type='text' defaultValue={''} value={jewelId}
                           onChange={event => setJewelId(event.target.value)} onKeyDown={handleKeyDown}/><br/>
                    <button>Find by Id</button>
                    {
                        jewels
                            .map(jewel => jewel.id === jewel ? <div key={jewel.id}>{jewel.name} | {jewel.price}</div> :
                                <div key={jewelId}/>)
                    }
                </form>
            </div>
        </>
    );
};

export default ShowJewels;