const mongoose = require("mongoose");
//schema
const PublicationSchema = mongoose.Schema({
    id: String,
      name: String,
      books: [String],
});

//model

const PublicationModel = mongoose.model(PublicationSchema);

module.exports = PublicationModel;