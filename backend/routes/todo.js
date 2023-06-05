const express = require( 'express');
const router = express.Router();

// Require controller modules.
const todoControllers = require('../controllers/todoControllers')

router.get('/', todoControllers.index);

router.post('/', todoControllers.insert);

router.put('/:id', todoControllers.update);

router.delete('/:id', todoControllers.delete);

module.exports = router;
