const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customers");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res
      .status(400)
      .send("The customer with the given id was not founded");

  res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(40).send("mmk");

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(40).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(400)
      .send("The customer with the given id was not founded");

  res.send(customer);
});

router.delete("/", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res
      .status(400)
      .send("The customer with the given id was not founded");

  res.send(customer);
});

module.exports = router;
