const express = require("express");
const db = require("../../../db")

const productRouter = express.Router();

productRouter.get("/", async (req, res)=>{
  const response = await db.query("SELECT * FROM products")
  res.send(response.rows)
});


productRouter.post("/", async (req, res) => {
  try{
    const result = await db.query(`INSERT INTO products (name, description, brand, price, category) 
                                       VALUES ($1,$2,$3,$4,$5) 
                                       RETURNING *`,
                                      [req.body.name, req.body.description, req.body.brand, req.body.price, req.body.category ])

        res.send(result.rows[0])
  } catch(err) {
    console.log(err)
    res.status(500).send(err)
  }
});

// productRouter.post("/img", async (req, res) => {
//   try{

//   } catch(err) {
//     console.log(err)
//     res.status(500).send(err)
//   }
// });

productRouter.put("/:id", async (req, res) => {
  try{
    const result = await db.query(`UPDATE products
                                       SET name = $1,
                                       description = $2,
                                       brand= $3,
                                       category= $4,
                                       price = $5
                                       WHERE id = $6`,
        [req.body.name, req.body.description, req.body.brand, req.body.category, req.body.price, req.params.id]);

        if (result.rowCount === 0)
            res.status(404).send("not found")
        else
            res.send("OK")
  } catch(err) {
    console.log(err)
    res.status(500).send(err)
  }
})

productRouter.delete("/:id", async (req, res) => {
  try {
      const result = await db.query(`DELETE FROM products WHERE id = $1`, [req.params._id])

      if (result.rowCount === 0)
          res.status(404).send("not found")
      else
          res.send("OK")
  }
  catch (ex) {
      res.status(500).send(ex)
  }
})



module.exports = productRouter;