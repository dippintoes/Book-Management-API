const mongoose = require("mongoose");

const AuthorSchema = mongoose.Schema({
    id: String,
      name: String,
      books: [String],
});

//create model

const AuthorModel = mongoose.model(AuthorSchema);

module.exports = AuthorModel;