const Dishes = require("../model/Dishes");
const localDishes = require("../model/localDishes");
const continentalDishes = require("../model/ContinentalDishes");
const trending = require("../model/trending");
const User = require("../model/user");
const { UnAuthorizedError, BadUserRequestError } = require("../error/error");

// Send the response to the client with or without errors
function sendStatus(msg, status = 0, data, err = false) {
  return {
    message: msg,
    status: status,
    data: data,
    error: err,
  };
}

class productController {
  //Get a list of all dishes in the 'all' category
  static async allDishes(req, res) {
    try {
      const allFoods = await Dishes.find({ available: true });
      return res.status(200).json({
        message: `Welcome to this foodOrdering site.`,
        data: allFoods,
      });
    } catch (error) {
      next(error);
    }
  }

  //Get food details
  static async FoodDetails(req, res, next) {
    try {
      const foodId = req.params.id;
      const foodDetails = await Dishes.findById(foodId);
      return res.status(200).json(foodDetails);
    } catch (error) {
      next(error);
    }
  }

  //Get a list of all local dishes in the 'Local' category
  static async localDishes(req, res) {
    await localDishes.find((err, localDishes) => {
      if (err) {
        console.log(err);
      } else {
        res.send(localDishes);
      }
    });
  }

  //Get a list of all continental dishes in the 'Continental' category
  static async continentalDishes(req, res) {
    await continentalDishes.find((err, continentalDishes) => {
      if (err) {
        console.log(err);
      } else {
        res.send(continentalDishes);
      }
    });
  }

  //Get a specific local dish in the 'Local' category
  // static async locDish (req,res){
  //   console.log(req.params.id);
  //  await localDishes.findOne({_id: req.params.id}, (err, locDish)=>{
  //     if(err){
  //       res.send(err)
  //     }else{
  //       res.send(locDish)
  //     }
  //   })
  //  };

  //Get a specific continental dish in the 'continental' category
  // static async continentalDish (req,res){
  //   console.log(req.params.id);
  //  await continentalDishes.findOne({_id: req.params.id}, (err, continentalDish)=>{
  //     if(err){
  //       res.send(err)
  //     }else{
  //       res.send(continentalDish)
  //     }
  //   })
  //  };

  //search functionality
  static async searchProduct(req, res) {
    const { restaurant, food, drink } = req.query;
    const queryObject = {};
    if (restaurant) {
      queryObject["name.restaurant"] = { $regex: restaurant, $options: "i" };
    }
    if (food) {
      queryObject["name.food.name"] = { $regex: food, $options: "i" };
    }
    if (drink) {
      queryObject["name.drink.name"] = { $regex: drink, $options: "i" };
    }
    const product = await Dishes.find(queryObject);
    if (!product || product.length === 0) {
      throw new BadUserRequestError("Product you requested for not found");
    }
    res.status(200).json({
      status: "Success",
      data: product,
    });
  }

  //returns the item present in the cart. If a user is signed in it gets the data from the userCart.js model otherwise from the session.
  //  static async fetchCart (req,res){
  //     if(req.session['email'] && !req.session['cart']){
  //       const userId = req.session.uid;
  //      await userCart.findOne({userId: userId}, async (err, usercart)=>{
  //         if(err){
  //           res.send(sendStatus(msg, 1, false, err))
  //         }else if(usercart){
  //           const data = usercart.data;
  //           const cart = new Cart(req.session['cart'] ? req.session['cart'] : {});
  //           for (var i = 0; i<data.length; i++){
  //             const id = data[i].itemId;
  //             const locDish = await this.localDishes.findOne({_id: id});
  //             locDish['quantity']= data[i].itemQty;
  //             cart.add(locDish, id)
  //           }
  //           req.session['cart']=cart;
  //           const c = cart.getList();
  //           res.send(c)
  //         }else{
  //           res.send(sendStatus("Something went wrong", 1, false))
  //         }
  //       })
  //     }else{
  //       const cart = new Cart(req.session['cart']?req.session['cart']:{})
  //       const c = cart.getList();
  //       res.send(c)
  //     }
  //   };

  //create product review
  static async productReview(req, res) {
    try {
      const { rating, comment } = req.body;
      const product = await Dishes.findById({ _id: req.params.id });
      if (product) {
        const alreadyReviewed = product.reviews.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
          throw new UnAuthorizedError("Product review already exists");
        }
        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
        };
        product.reviews.push(review);
        product.numReview = product.reviews.length;
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
        product.save();
        res.status(201).json({ message: "Review added" });
      } else {
        throw new BadUserRequestError("Product review failed");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  //Get a list of all trending dishes
  static async trendingDishes(req, res) {
    try {
      const trendingFoods = await trending.find({ available: true });
      return res.status(200).json({
        message: `See the trending food by orders`,
        data: trendingFoods,
      });
    } catch (error) {
      next(error);
    }
  }

  //Get a specific trending food
  static async trendingFood(req, res, next) {
    try {
      const foodId = req.params.id;
      const foodDetails = await trending.findById(foodId);
      return res.status(200).json(foodDetails);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrendingFood(req, res, next) {
    try {
      let foodId = req.params.id
      let foundFood = await trending.findOne({_id: foodId})
      if (!foundFood) {
        const err = new Error()
        err.name = "Not Found"
        err.status = 404
        err.message = "The food you are looking for wasn't found"
        throw err
      }
      
      const del = await foundFood.deleteOne()
      res.json({"message": `${del.name} was deleted successfully`})
    } catch (error) {
      next(error)
    }
  }

  static async fetchAddress(req, res) {
    if (req.session["email"]) {
      await User.findOne(
        { email: req.session["email"] },
        { address: 1 },
        (err, data) => {
          if (err) res.send(err);
          else {
            console.log(data);
            data["status"] = 1;
            res.send(data);
          }
        }
      );
    } else {
      res.send(sendStatus("Nothing to fetch", 0, false));
    }
  }
}

module.exports = productController;
