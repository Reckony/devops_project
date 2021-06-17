import React, {useState, useEffect} from "react";
import axios from "axios";
import Post from "./Post";
import setPosts from "./Post";

const MyForm = (props) => {

    const[title, setTitle] = useState("");
    const[body, setBody] = useState("");

    const handleSubmit = (event) => {
        console.log('Dane do wyslania');

        axios.post('https://jsonplaceholder.typicode.com/posts', {
            title: title,
            body: body,
            userId: 1
        })
            .then(response => setPosts(response.data))
            .catch(error => console.log(error));
         event.preventDefault();

    };

    return (
        <>
            <input type='text' value={title} onChange={event => setTitle(event.target.value)}/> <br/>
            <input type='text' value={body} onChange={event => setBody(event.target.value)}/> <br/>

            <input type='submit' value='OK' onClick={handleSubmit}/>
        </>
    );

};

export default MyForm;