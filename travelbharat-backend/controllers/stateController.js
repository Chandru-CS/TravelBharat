const State = require("../models/State");

exports.getStates = async (req, res) => {
  const states = await State.find();
  
  // Sort states: Karnataka first, then alphabetically
  const sortedStates = states.sort((a, b) => {
    if (a.name.toLowerCase() === 'karnataka') return -1;
    if (b.name.toLowerCase() === 'karnataka') return 1;
    return a.name.localeCompare(b.name);
  });
  
  res.json(sortedStates);
};

exports.addState = async (req, res) => {
  const state = await State.create(req.body);
  res.json(state);
};