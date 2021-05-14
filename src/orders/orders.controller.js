const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
//LIST
function list(req, res) {
    res.json({ data: orders });
}

//Validate order
function isValidOrder(req, res, next) {
    const { id, deliverTo = "", mobileNumber = "", dishes = []} = req.body.data;
    const orderFields = [ "deliverTo", "mobileNumber", "dishes"];
    //check for required fields
    for (const field of orderFields) {
        if (!req.body.data[field] || req.body.data[field] === undefined) {
            return next({
                status: 400,
                message: `Order must include a ${field}.`
            });
        }
    }
    //dishes array check
    if (!Array.isArray(dishes) || dishes.length === 0) {
        return next({
            status: 400,
            message: `Order must include at least one dish.`
        })
    }
    //dishes quantity check
    for (let i = 0; i < dishes.length; i++) {
        if (!dishes[i].quantity || !Number.isInteger(dishes[i].quantity)) {
            return next({
                status: 400,
                message: `Dish quantity: ${[i]} is not properly formatted.`
            });
        }
    }
    //order id check
    const orderId = req.params.orderId;
    if (orderId !== id && id) {
        return next({
            status: 400,
            message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`
        })
    }
    next();
}

//CREATE
function create(req, res, next) {
    const { data: { deliverTo, mobileNumber, dishes } } = req.body;
    const newOrder = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status: "delivered",
        dishes,
    };
    orders.push(newOrder);
    res.status(201).json({ data: newOrder });
}

//Does order exist?
function orderExists(req, res, next) {
    const orderId = req.params.orderId;
    const foundOrder = orders.find(order => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        next();
    }
    return next({
        status: 404,
        message: `Order does not exist: ${orderId}`,
    });
}

//READ
function read(req, res, next) {
    res.json({ data: res.locals.order });
}

//UPDATE
function update(req, res, next) {
    const orderId = req.params.orderId;
    const order = res.locals.order;
    const foundOrder = orders.find((order) => order.id === orderId)
    const { data: { status, deliverTo, mobileNumber, dishes } = {}} = req.body;
    if (!foundOrder) {
        return next({
            status: 404,
            message: `Order does not match route id: ${orderId}.`
        })
    }
    if (!status || status === "delivered" || status === "invalid") {
        return next({
            status: 400,
            message: `Order must have a status of pending, preparing, out-for-delivery, delivered.`
        })
    }
    order.status = status;
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.dishes = dishes;

    res.json({ data: order });
}

function destroy(req, res, next) {
    const { orderId } = req.params;
    const order = res.locals.order;
    const index = orders.findIndex((order) => order.id === orderId);
    if (index > -1) {
        orders.splice(index, 1);
    }
    if (order.status === "pending") {
        res.sendStatus(204)
    } else {
        next({
            status: 400,
            message: `An order cannot be deleted unless it is pending.`
        })
    }
}

module.exports = {
    list,
    create: [isValidOrder, create],
    read: [orderExists, read],
    update: [orderExists, isValidOrder, update],
    delete: [orderExists, destroy],
};
