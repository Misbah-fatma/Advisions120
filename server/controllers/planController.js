const Plan = require('../model/PlanModel');

const createPlan = async (req, res) => {
  const { title, price, type, features } = req.body;
  const newPlan = new Plan({ title, price, type, features });
  try {
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a plan
const updatePlan = async (req, res) => {
  const { id } = req.params;
  const { title, price, type, features } = req.body;
  try {
      const updatedPlan = await Plan.findByIdAndUpdate(id, { title, price, type, features }, { new: true });
      if (!updatedPlan) {
          return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json(updatedPlan);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

// Delete a plan
const deletePlan = async (req, res) => {
  const { id } = req.params;
  try {
      const deletedPlan = await Plan.findByIdAndDelete(id);
      if (!deletedPlan) {
          return res.status(404).json({ message: 'Plan not found' });
      }
      res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};


module.exports = { createPlan, getPlans, updatePlan, deletePlan };
