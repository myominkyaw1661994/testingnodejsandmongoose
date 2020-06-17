const Joi = require("@hapi/joi");
const mongosse = require("mongoose");

const Rental = mongosse.model(
  "Rental",
  new mongosse.Schema({
    customer: {
      type: new mongosse.Schema({
        name: {
          type: String,
          required: true,
          minlength: 4,
          maxlength: 55,
        },
        phone: {
          type: String,
          required: true,
          minlength: 4,
          maxlength: 55,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongosse.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          minlength: 0,
          maxlength: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      default: Date.now(),
    },
    dateReturn: {
      type: Date,
    },
    rentalfee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRenatal(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRenatal;
