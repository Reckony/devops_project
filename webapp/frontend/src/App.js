import React from 'react';
import './App.css';
import DeleteJewel from "./DeleteJewel";
import ShowJewels from "./ShowJewels";
import AddJewel from "./AddJewel";
import UpdateJewel from "./UpdateJewel";

const App = (props) => {

    return (
        <>
            <AddJewel/>
            <DeleteJewel/>
            <UpdateJewel/>
            <ShowJewels/>
        </>
    );
}

export default App;