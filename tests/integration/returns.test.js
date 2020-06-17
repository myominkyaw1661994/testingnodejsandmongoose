const request = require("supertest");
const { Rental } = require("../../models/rentals");
const { User } = require("../../models/users");
const { Movie } = require("../../models/movies");
const mongoose = require("mongoose");
const moment = require("moment");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  const exec = async () => {
    return await request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId: customerId, movieId: movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    movie = new Movie({
      _id: movieId,
      title: 12345,
      genre: { name: "12345" },
      dailyRentalRate: 2,
      numberInStock: 10,
    });

    await movie.save();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  it("should return 401 error if no auth", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customer id is no provide", async () => {
    customerId = "";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movie id is no provide", async () => {
    movieId = "";
    exec();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 no rental found for this customerId and movieId", async () => {
    await Rental.deleteOne({ _id: rental._id });
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if dateReturn is alredy Process", async () => {
    rental.dateReturn = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set returnDate if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturn;
    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should set the rentalFee if input is valid", async () => {
    rental.dataOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalfee).toBeDefined();
  });

  it("should increase the number of movie in stock", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(11);
  });

  it("should return rental if the input is valid", async () => {
    const res = await exec();

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturn",
        "rentalfee",
        "customer",
        "movie",
      ])
    );
  });
});
