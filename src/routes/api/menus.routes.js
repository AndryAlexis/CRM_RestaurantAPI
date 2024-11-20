const express = require('express');
const router = require('express').Router();

const { getById, getAll } = require('../../controllers/api/menus.controllers');



router.get('/', getAll);
router.get('/:menuId', getById);


module.exports = router;