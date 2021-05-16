const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function list(req, res, next) {
    res.json({ data: dishes });
}

//checks if all fields in create dish form are present
function isValidDish(req, res, next) {
    //validate fields
    const dishFields = ["name", "description", "price", "image_url"];
    for (const field of dishFields) {
        if (!req.body.data[field]) {
            return next({
                status: 400,
                message: `Dish must include a ${field}`,
            });
        }
    }
    //validate price
    if (req.body.data["price"] < 0 || !Number.isInteger(req.body.data["price"])) {
        return next ({
            status: 400,
            message: `Dish price must be an integer and be greater than 0.`,
        });
    }
    //validate id
    const dishId = req.params.dishId;
    const id = req.body.data.id;
    if (dishId !== id && id) {
        return next ({
            status: 400,
            message: `${id} id does not match ${dishId} id`,
        });
    }
    next();
}

//creates a new dish
function create(req, res, next) {
    const { data: { name, price, description, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

//returns a specific dish
function read(req, res, next) {
    res.json({ data: res.locals.dish });
}

//does the dish exist?
function dishExists(req, res, next) {
    const dishId = req.params.dishId;
    const foundDish = dishes.find(dish => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish id not found ${req.params.dishId}`,
    });
};

//UPDATE
function update(req, res, next) {
    const dishId = req.params.dishId;
    const dish = res.locals.dish;
    let foundDish = dishes.find((dish) => dish.id === dishId);
    const { data: { name, description, price, image_url }} = req.body;
    if (!foundDish) {
       return next({
            status: 400,
            message: `No dish matches that id: ${dishId}`,
        })
    } 
        dish.name = name;
        dish.description = description;
        dish.price = price;
        dish.image_url = image_url;
        res.json({ data: dish });
    
}

module.exports = {
    list,
    create: [isValidDish, create],
    read: [dishExists, read],
    update: [ dishExists, isValidDish, update]
};
