import { useState } from "react";
import userContext from "./userContext";
import axios from 'axios'

const UserState = (props) => {
    const [jokes, setjokes] = useState([])

    //get all joke from the backend
    const getJoke = async () => {
        axios.get('/api/joke').then((res) => {
            setjokes(res.data);
        }).catch(err => {
            console.error(err)
        })
    }


    return (
        <userContext.Provider value={{ jokes,getJoke }}>
            {props.children}
        </userContext.Provider>

    )
}

export default  UserState
