import { useState, useEffect } from 'react'
import './App.css'
import UserState from '../Context/User/userState.jsx'
import Joke from './Components/Joke'

function App() {
  // const [joke, setjoke] = useState([])
  // useEffect(() => {
  //   axios.get('/api/joke')
  //     .then(res => {
  //       setjoke(res.data)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // })

  return (
    <>
      <UserState>
        <Joke />
      </UserState>
    </>
  )
}

export default App
