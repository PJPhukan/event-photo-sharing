import 'dotenv/config'
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
const joke = [
    {
        title: "First joke",
        content: "This is first joke content "
    }
]

app.get('/api/joke', (req, res) => {
    res.send(joke)
})

app.listen(port, () => {
    console.log(`Eventphoto sharing app running on http://localhost:${port}`)
})