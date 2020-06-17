const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movies");
const { Genre } = require("../models/genres");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("title");
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(400).send("The movie with the given id was not founded");

  res.send(movie);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(40).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(40).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(400).send("The movies with the given id was not founded");

  res.send(movie);
});

router.delete("/", async (req, res) => {
  const movie = await Customer.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(400).send("The movie with the given id was not founded");

  res.send(movie);
});

module.exports = router;
