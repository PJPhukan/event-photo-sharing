import React, { useContext, useEffect } from 'react'
import userContext from '../../Context/User/userContext'
const Joke = () => {
    const { jokes, getJoke } = useContext(userContext);
    useEffect(() => {
        getJoke();
    })


    return (

        <div>
            <h3>Random Joke</h3>
            <p>{jokes ? jokes.setup : "Loading..."}</p>

            {
                jokes.map(
                    item => <div key={item.title}>
                        <h1>{item.title}</h1>
                        <p>{item.content}</p>
                    </div>
                )
            }
        </div>
    )
}

export default Joke
