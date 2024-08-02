const express = require('express');
const router = express.Router();
const { registerSchool, getSchools, updateSchool, deleteSchool } = require('../controllers/schoolController');
const { requireLogin } = require('../middlewares/requireLogin');


router.post('/register', requireLogin, registerSchool);

router.get('/allschools', getSchools);

router.put('/:id', updateSchool);

router.delete('/:id', deleteSchool);

module.exports = router;
