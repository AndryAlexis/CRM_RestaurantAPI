const { selectById, selectAll, createMenu } = require("../../models/api/menus.models");

const getById = async (req, res, next) => {
    const { menuId } = req.params;
    try {
        const menu = await selectById(menuId);
        res.json(menu)
    } catch (error) {
        next(error);
    }
}

const getAll = async (req, res, next) => {
    try {
        const menus = await selectAll();
        res.json(menus)
    } catch (error) {
        next(error);
    }
}

const generateMenu = async (req, res, next) => {
    const { date, name, dishes } = req.body;

    try {
        const newMenu = await createMenu(date, name, dishes);
        if (!newMenu === 0) { // Si no se pudo crear el menu error
            return res.status(500).json({ message: 'Error creating menu' });
        }
        res.json({ message: `menu ${date} created successfully` });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    getById,
    getAll,
    generateMenu
}