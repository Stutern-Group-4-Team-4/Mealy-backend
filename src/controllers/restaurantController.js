const Restaurant = require("../model/Restaurant");

class restaurantController{
    // Get All Restaurants
static async getAllRestaurants (req, res){
try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ status: "success", data: { restaurants } });
} catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "error", msg: err.message });
}
};

// Get Restaurant
static async getRestaurant (req, res){
try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
    "dishes"
    );
    res.status(200).json({ status: "success", data: { restaurant } });
} catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "error", msg: err.message });
}
};

// Update Restaurant
static async updateRestaurant(req, res){
try {
    const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
        new: true
    }
    );
    res.status(201).json({ status: "success", data: { restaurant } });
} catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "error", msg: err.message });
}
};

// Get Restaurant by user
static async getMyRes (req, res){
try {
    const restaurant = await Restaurant.find({ user: req.user });
    res.status(200).json({ status: "success", data: { restaurant } });
} catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "error", msg: err.message });
}
}
}

module.exports = restaurantController;