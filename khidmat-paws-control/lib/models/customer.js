const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  customer_number: { type: String, required: true },
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
module.exports = Customer;