import express from 'express'

const app = express();
const port = 7777;

app.use('/test',(req, res)=>{
    res.send('Hello from the server - test route!')
})
app.use('/',(req, res)=>{
    res.send('Namaste Bro!')
})


app.listen(port, ()=> console.log(`Server is listening on port ${port}`))