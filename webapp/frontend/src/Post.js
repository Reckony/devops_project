import React, {useState, useEffect} from "react";
import axios from "axios";

const Post = (props) => {

    const [posts, setPosts]= useState([]);
    const [number, setNumber] = useState(-1);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(response => setPosts(response.data))
        .catch(error => console.log(error));
    }, []);

    const handlePostClick = (event) => {
        console.log(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNumber(event.target.value);
        props.changeParentHandler(event.target.value);
    };

    return (
        <>
            <div>
                {posts
                    .slice(0, props.noPosts)
                    .map(post => (<div key={post.id} onClick={handlePostClick}>{post.title}</div>))}
            </div>
            <div>
                <input onChange={handleNumberChange}/>
            </div>

        </>
    );

}

export default Post;

