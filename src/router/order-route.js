const express = require("express")
const router = express.Router()
const order = require("../controllers/orders")


router.post(
    "/",
    order.checkout
)

router.get(
    "/",
    order.orderHistory
)

module.exports = router