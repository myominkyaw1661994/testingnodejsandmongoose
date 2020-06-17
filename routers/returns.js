const express = require("express");
const { Rental } = require("../models/rentals");
const router = express.Router();
const auth = require("../middleware/auth");
const moment = require("moment");
const { Movie } = require("../models/movies");
const Joi = require("@hapi/joi");
const validator = require("../middleware/validate");

router.post("/", [auth, validator(validateReturn)], async (req, res) => {
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) {
    return res.status(404).send("no renatal found");
  }

  if (rental.dateReturn)
    return res.status(400).send("Returned already Process");

  rental.dateReturn = new Date();
  rental.rentalfee =
    moment().diff(rental.dateOut, "days") * rental.movie.dailyRentalRate;

  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
