const router = require("express").Router();
const {list, create} = require("./dishes.controller");

// TODO: Implement the /dishes routes needed to make the tests pass

router
    .router("/")
    .get(list)
    .post(create);


module.exports = router;
