const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Category = new Schema({
  name: {
    type: String,
    require: true
  },
  total: {
    type: Number,
    default: 0,
  }
})

module.exports = mongoose.model('Category', Category)