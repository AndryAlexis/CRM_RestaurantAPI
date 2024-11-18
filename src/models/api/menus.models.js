const pool = require('../../config/db');

const selectById = async (id) => {
    const [result] = await pool.query('SELECT * FROM menu WHERE id = ?', [id]);
    const [menu_has_dish] = await pool.query('SELECT * FROM menu_has_dish WHERE menu_id = ?', [id]);
    let dishes = [];
    for (const dish of menu_has_dish) {
        const [resultDish] = await pool.query('SELECT * FROM dish WHERE id = ?', [dish.dish_id]);
        dishes.push(resultDish);
    };
    const menu = result[0];
    menu.dishes = dishes;
    return menu;

}
const selectAll = async () => {
    const [menus] = await pool.query('SELECT * FROM menu');
    const menusWithDishes = [];
    for (const menu of menus) {
        const [menu_has_dish] = await pool.query('SELECT * FROM menu_has_dish WHERE menu_id = ?', [menu.id]);
        let dishes = [];
        for (const dish of menu_has_dish) {
            const [resultDish] = await pool.query('SELECT * FROM dish WHERE id = ?', [dish.dish_id]);
            if (resultDish && resultDish.length > 0) {
                dishes.push(resultDish[0]);
            }
        };
        menu.dishes = dishes;
        menusWithDishes.push(menu);
    };
    console.log(menusWithDishes);
    return menusWithDishes;
}

const createMenu = async (date) => {
    const [result] = await pool.query('INSERT INTO menu (date) VALUES (?)', [date]);
    return result;

}
module.exports = {
    selectById,
    selectAll,
    createMenu
};