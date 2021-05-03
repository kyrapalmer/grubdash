const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res, next) {
    res.json({ data: dishes });
}

function isValidDish(req, res, next) {
    const requriedFields = ["name", "description", "price", "image_url"];
    for (const field of requriedFields) {
        if (!req.body[field]) {
            next({
                status: 400,
                message: `Dish must include a ${field}`,
            });
            return;
        }
    }
    next();
}

function create(req, res, next) {
    const { data: { name, price, description, image_url } = {} } = req.body;
    const newDish = {
        
    }
    res.send();

}

module.exports = {
    list,
    create: [isValidDish, create],
};