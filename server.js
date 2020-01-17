const express = require("express");
const productRouter = require("./src/routes/products");
const reviewRouter = require("./src/routes/reviews");
const cartRouter = require("./src/routes/cart")
const dotenv = require("dotenv")
const cors = require ("cors");
const server = express()
dotenv.config();
const port = process.env.PORT;
const listEndpoints = require("express-list-endpoints");

server.use(express.json());
server.use(cors());
server.use("/products", productRouter);
server.use('/reviews', reviewRouter);
server.use('/cart', cartRouter)

const db = require("./db");
server.get("/", async (req, res)=>{
    const response = await db.query("SELECT * FROM products")
    res.send(response.rows)
 })

console.log(listEndpoints(server));


server.listen(process.env.PORT, () => {
    console.log(`Heeeey, your server is running on port ${process.env.PORT}!`);
});