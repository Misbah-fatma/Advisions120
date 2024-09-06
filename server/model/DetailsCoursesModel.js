const mongoose = require('mongoose');

// Define a schema for the cards
const cardChannelSchema = new mongoose.Schema({
    icon: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true }
});

const detailsChannelSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true }, 
    cards: [cardChannelSchema], 
    features: { type: String, required: true },
    overview: { type: String, required: true }
});

module.exports = mongoose.model('DetailsCourses', detailsChannelSchema);
