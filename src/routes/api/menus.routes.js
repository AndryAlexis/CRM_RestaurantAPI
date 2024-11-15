const express = require('express');
const router = require('express').Router();

const { getById, getAll, generateMenu } = require('../../controllers/api/menus.controllers');

router.get('/:menuId', getById);
router.get('/', getAll);
router.post('/menus', generateMenu);




module.exports = router;