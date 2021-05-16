const router = require("express").Router();
const {list, create, read, update } = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

router
    .route("/:dishId")
    .get(read)
    .put(update)
    .all(methodNotAllowed)

router
    .route("/")
    .get(list)
    .post(create)
    .all(methodNotAllowed)



module.exports = router;
