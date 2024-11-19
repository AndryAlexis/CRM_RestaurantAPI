const express = require('express');
const router = require('express').Router();

const { getById, getAll, generateMenu, deleteMenu, updateById } = require('../../controllers/api/menus.controllers');

router.put('/:menuId', updateById);
router.delete('/:menuId', deleteMenu);
router.get('/:menuId', getById);
router.get('/', getAll);
router.post('/', generateMenu);




module.exports = router;