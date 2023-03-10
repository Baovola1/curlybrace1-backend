const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({
    name: String,
    lat: Number,
    lon: Number,
    country: String,
});

const tagSchema = mongoose.Schema({
    art: Boolean,
    gaming: Boolean,
    food: Boolean,
    finance: Boolean,
    health: Boolean,
    science: Boolean,
    sport: Boolean,
});

const languageSchema = mongoose.Schema({
  javascript: Boolean, 
  python: Boolean,
  cplusplus: Boolean,
  php: Boolean,
  ruby: Boolean,
  react: Boolean,
});

const projectSchema = mongoose.Schema({
  user: String,
  title: String,
  shortDescription: String,
  description: String,
  banner: String,
  image: String,
  location: locationSchema,
  tags: tagSchema,
  isPaid: Boolean,
  isHelp: Boolean,
  languages: languageSchema,
  level: String,
  isPro: Boolean,
  isStarted: Boolean,
  isComplete: Boolean,
});

const Project = mongoose.model('projects', projectSchema);

module.exports = Project;
