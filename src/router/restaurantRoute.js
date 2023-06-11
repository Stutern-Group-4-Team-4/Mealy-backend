const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/", restaurantController.getAllRestaurants);
router.get(
    "/myres",
    restaurantController.getMyRes
  );
  router.get("/:id", restaurantController.getRestaurant);
  router.patch(
    "/:id",
    restaurantController.updateRestaurant
  );

  module.exports = router;