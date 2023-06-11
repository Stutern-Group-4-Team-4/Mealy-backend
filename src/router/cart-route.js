const express = require("express")
const router = express.Router()
const CartClass = require("../controllers/Cart")


router.get(
    "/",
    CartClass.allCartItem
)

router.put(
    "/:id/:qty",
    CartClass.editCart
)

router.post(
    "/:id/:qty",
    CartClass.addToCart
)

router.delete(
    "/:id",
    CartClass.removeFromCart
)

module.exports = router