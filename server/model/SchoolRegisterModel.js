// models/school.js

const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: { type: String},
    address: { type: String },
    email: { type: String },
    phone: { type: String  },
    principalId : {
        type: String,
       
      },
});

module.exports = mongoose.model('School', schoolSchema);
