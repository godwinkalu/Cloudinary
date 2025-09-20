const express = require('express')
require('./config/database')
const  userRouter  = require('./routes/userRouter')
const productRouter = require('./routes/productRouter')
const  port = process.env.port || 1909


const app  = express()
app.use(express.json())
app.use(userRouter)
app.use(productRouter)

app.listen(port, ()=>{
  console.log(`my server is running on  port: ${port}`);
  
})
