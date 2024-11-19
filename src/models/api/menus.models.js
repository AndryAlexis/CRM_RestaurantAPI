const pool = require('../../config/db');

/**  This function retrieves a menu by its ID from the database, along with its associated dishes.
The function works in the following steps: **/
const selectById = async (id) => {
    // Step 1: Query the 'menu' table to get the menu details by its ID.
    const [result] = await pool.query('SELECT * FROM menu WHERE id = ?', [id]);
    // Step 2: Query the 'menu_has_dish' table to get the dish associations for the specified menu.
    const [menu_has_dish] = await pool.query('SELECT * FROM menu_has_dish WHERE menu_id = ?', [id]);
    // Initialize an array to hold the dishes associated with the menu.
    let dishes = [];
    // Step 3: Loop through each menu-dish association and fetch the dish details from the 'dish' table.
    for (const dish of menu_has_dish) {
        // Query the 'dish' table to get the details of the dish by its ID.
        const [resultDish] = await pool.query('SELECT * FROM dish WHERE id = ?', [dish.dish_id]);
        // Add the fetched dish details to the 'dishes' array.
        dishes.push(resultDish);
    };
    // Step 4: Attach the list of dishes to the menu object.
    const menu = result[0];
    // Assign the 'dishes' array to the menu object as its 'dishes' property.
    menu.dishes = dishes;
    // Return the complete menu object with its associated dishes.
    return menu;
}

/**This function retrieves all menus from the database, along with their associated dishes.
 * It performs multiple database queries to gather the relevant data and returns an array of menus,
 * each containing its respective dishes.**/
const selectAll = async () => {
    // Step 1: Query the 'menu' table to get all available menus
    const [menus] = await pool.query('SELECT * FROM menu');
    // Initialize an array to hold menus with their respective dishes
    const menusWithDishes = [];
    // Step 2: Loop through each menu to fetch associated dishes
    for (const menu of menus) {
        // Query the 'menu_has_dish' table to get the dish associations for the current menu
        const [menu_has_dish] = await pool.query('SELECT * FROM menu_has_dish WHERE menu_id = ?', [menu.id]);
        // Initialize an array to hold the dishes for the current menu
        let dishes = [];
        // Step 3: For each menu-dish association, fetch the dish details from the 'dish' table
        for (const dish of menu_has_dish) {
            // Query the 'dish' table to get the dish details by dish_id
            const [resultDish] = await pool.query('SELECT * FROM dish WHERE id = ?', [dish.dish_id]);
            // If the dish exists and has valid data, add it to the dishes array
            if (resultDish && resultDish.length > 0) {
                dishes.push(resultDish[0]);
            }
        };
        // Step 4: Attach the list of dishes to the current menu object
        menu.dishes = dishes;
        // Add the menu with its associated dishes to the final result array
        menusWithDishes.push(menu);
    };
    // Return the array of menus, each with its associated dishes
    return menusWithDishes;
}

/**
 * Creates a new menu with the given date, name and associated dishes.
 * @param {String} date - The date of the menu in the format 'YYYY-MM-DD'
 * @param {String} name - The name of the menu
 * @param {number[]} dishes - An array of dish IDs associated with the menu
 * @returns {Promise<Object>} A Promise that resolves with the newly created menu object
 */
const createMenu = async (date, name, dishes) => {
    // Step 1: Insert the new menu into the 'menu' table with the provided 'date' and 'name'.
    // The query returns the result object containing the menu's inserted ID.
    const [result] = await pool.query('INSERT INTO menu (date, name) VALUES (?, ?)', [date, name]);
    // Step 2: Retrieve the 'insertId' of the newly created menu, which is the unique ID of the menu.
    const menuId = result.insertId;
    // Step 3: Iterate over each dish ID in the 'dishes' array and create a link between the new menu and the dishes.
    for (const dish_id of dishes) {
        // For each dish, insert a record into the 'menu_has_dish' table, associating the menu with the dish.
        await pool.query('INSERT INTO menu_has_dish (menu_id, dish_id) VALUES (?, ?)', [menuId, dish_id]);
    }
    // Step 4: Return the result object, which contains the details of the inserted menu.
    return result;
}

/**
 * Deletes a menu from the database by its ID.
 * @param {number} id - The ID of the menu to delete
 * @returns {Promise<boolean>} True if deletion was successful (menu existed and was deleted), false otherwise
 */
const deleteMenuById = async (id) => {
    // Step 1: Execute the DELETE query to remove the menu with the specified ID from the 'menu' table.
    const [result] = await pool.query('DELETE FROM menu WHERE id = ?', [id]);
    // Step 2: Return true if the deletion affected at least one row, meaning the menu was successfully deleted. And return false if no menu was found.
    return result.affectedRows > 0;
}
module.exports = {
    selectById,
    selectAll,
    createMenu,
    deleteMenuById
};