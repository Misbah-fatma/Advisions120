const express = require('express');
const router = express.Router();
const { createPlan, getPlans, updatePlan, deletePlan } = require('../controllers/planController');

router.post('/plans', createPlan);
router.get('/plans', getPlans);
router.put('/plans/:id', updatePlan);

// Route to delete a specific plan by ID
router.delete('/plans/:id', deletePlan);

module.exports = router;
