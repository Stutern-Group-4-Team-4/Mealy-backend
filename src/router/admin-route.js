const express = require("express")
const router = express.Router()
const controller = require("../controllers/admin")


router.post(
    "/",
    controller.newFood
)

router.get(
    "/allfoods",
    controller.allFoods
)

router.post(
    "/makeavailable",
    controller.makeFoodAvailable
)

router.post(
    "/makeadmin",
    controller.makeAdmin
)

router.delete(
    "/:id",
    controller.deleteFood
)
 
module.exports = router