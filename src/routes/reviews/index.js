const express = require("express");
const db = require("../../../db")

const reviewRouter = express.Router();

reviewRouter.get("/", async (req, res)=>{
  const response = await db.query("SELECT * FROM reviews")
  res.send(response.rows)
})

reviewRouter.get("/:productid/reviews", async (req, res)=>{
  try{
      const reviews = await db.query(`SELECT * FROM reviews
                                      WHERE productid= $1`, 
                                      [req.params.id])

      res.send(reviews.rows)
  }
  catch (ex) {
      res.status(500).send(ex)
  }
})

reviewRouter.post("/:productid/reviews", async (req, res)=>{
  try{
      const newReview = await db.query(`INSERT INTO reviews (productid, comment, rate)
                                      VALUES ($1,$2,$3)
                                      RETURNING *`, 
                                      [ req.params.id, req.body.comment, req.body.rate])

      res.send(newReview.rows[0])
  }
  catch (ex) {
      res.status(500).send(ex)
  }
})

reviewRouter.put("/:productId/reviews/:reviewId", async (req, res)=>{
  try{
      const updatedReview = await db.query(`UPDATE reviews 
                                      SET comment = $1,
                                      rate = $2,
                                      UpdatedAt = $3
                                      WHERE _id = $4`,
                                      [ req.body.comment, req.body.rate, new Date(), req.params.reviewId])

      if (updatedReview.rowCount === 0)
          return res.status(404).send("NOT FOUND!")
      else
          res.send("OK")
  }
  catch(ex){
      res.status(500).send(ex)
  }
})

reviewRouter.delete("/:productId/reviews/:reviewId", async(req,res)=>{
  try{
      const deleteQuery = await db.query("DELETE FROM reviews WHERE _id = $1", [req.params.reviewId])

      if (deleteQuery.rowCount === 0)
          return res.status(404).send("NOT FOUND!")
      else 
          res.send("OK")
  }
  catch(ex){
      res.status(500).send(ex)
  }
})


module.exports = reviewRouter;
