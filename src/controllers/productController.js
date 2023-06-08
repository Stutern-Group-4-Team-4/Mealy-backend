
const Dishes = require('../model/Dishes');
const Cart = require('../model/Cart');
const User = require('../model/user');
const userCart = require('../model/userCart');
const { UnAuthorizedError, BadUserRequestError } = require('../error/error');


// Send the response to the client with or without errors
function sendStatus(msg, status = 0, data, err = false){
    return {
      message: msg,
      status: status,
      data: data,
      error: err
    };
  }

class productController{
  updateUserCart(req, res, msg, data = false){
    const userId = req.session.uid;
    const cart = new Cart(req.session['cart']? req.session['cart']:{});
    const cartData = cart.getListDB();
    const totalQty = cart.totalQty;
    const totalPrice = cart.totalPrice;

    userCart.findOne({userId: userId},(err, usercart)=>{
      if(err){res.send(sendStatus(msg, 1, data, err))}
      else if(usercart){
        usercart.totalPrice = totalPrice;
        usercart.totalQty = totalQty;
        usercart.data = cartData;
        usercart.save(err=>{
          if(err){
            res.send(sendStatus(msg, 1,data, err))
          }
          else res.send(sendStatus(msg, 1, data));
        })
      }
      else{
        const newUserCart = new userCart({
          userId: userId,
          totalQty: totalQty,
          totalPrice: totalPrice,
          data: cartData
        });
        newUserCart.save(err=>{
          if(err){
            res.send(sendStatus(msg, 1, data, err))
          }else res.send(sendStatus(msg, 1, data))
        })
      }
    })
  };

  //Get a list of all dishes in the 'all' category
  allDishes(req,res){
    Dishes.find((err, allDishes)=>{
      if(err){
        console.log(err);
      }else{
        res.send(allDishes)
      }
    })
  };

  //Get a specific dish in the 'all' category
  specificDish (req,res){
    console.log(req.params.id);
    Dishes.findOne({_id: req.params.id}, (err, specificDish)=>{
      if(err){
        res.send(err)
      }else{
        res.send(specificDish)
      }
    })
   };

   //Get a list of all local dishes in the 'Local' category
   localDishes (req,res){
    Dishes.find((err, localDishes)=>{
      if(err){
        console.log(err);
      }else{
        res.send(localDishes)
      }
    })
  };

  //Get a list of all continental dishes in the 'Continental' category
   continentalDishes (req,res){
    Dishes.find((err, continentalDishes)=>{
      if(err){
        console.log(err);
      }else{
        res.send(continentalDishes)
      }
    })
  };


  //Get a specific local dish in the 'Local' category
   locDish (req,res){
    console.log(req.params.id);
    Dishes.findOne({_id: req.params.id}, (err, locDish)=>{
      if(err){
        res.send(err)
      }else{
        res.send(locDish)
      }
    })
   };

   //Get a specific continental dish in the 'continental' category
   continentalDish (req,res){
    console.log(req.params.id);
    Dishes.findOne({_id: req.params.id}, (err, locDish)=>{
      if(err){
        res.send(err)
      }else{
        res.send(continentalDish)
      }
    })
   };


   //basic functionality is just to add an item to the cart session by using Cart.js class. If the user is signed in then it further adds that item to the userCart.js model with the userid by taking help of function updateUserCart(req, res, msg, data = false) written in same CartControllers.js file.
   addCart(req, res){
    const {item} = req.body;
    const cart = new Cart(req.session['cart']? req.session['cart']:{});
    cart.add(item, item.id);
    req.session['cart']= cart;
    const success_msg = 'ITEM_ADDED_SUCCESSFULLY';
    if(!req.session['email']){
      res.send(sendStatus(success_msg, 1, false))
    }else{
      updateUserCart(req,res,success_msg)
    }
  
  };


  //search functionality
  searchProduct(req,res){
    const{restaurant, food, drink}= req.query
    const queryObject = {};
    if(restaurant){
      queryObject['name.restaurant'] = {$regex: restaurant, $options: 'i'}
  }
  if(food){
      queryObject['name.food.name'] = {$regex: food, $options: 'i'}
  }
  if(drink){
      queryObject['name.drink.name'] = {$regex: drink, $options: 'i'}
  }
  const product =  Dishes.find(queryObject)
  if(!product || product.length === 0){
      throw new BadUserRequestError("Product you requested for not found")
  }
  res.status(200).json({
      status:"Success",
      data:product
  })
    }
  


  //returns the item present in the cart. If a user is signed in it gets the data from the userCart.js model otherwise from the session.
  fetchCart (req,res){
    if(req.session['email'] && !req.session['cart']){
      const userId = req.session.uid;
      userCart.findOne({userId: userId}, async (err, usercart)=>{
        if(err){
          res.send(sendStatus(msg, 1, false, err))
        }else if(usercart){
          const data = usercart.data;
          const cart = new Cart(req.session['cart'] ? req.session['cart'] : {});
          for (var i = 0; i<data.length; i++){
            const id = data[i].itemId;
            const locDish = await this.localDishes.findOne({_id: id});
            locDish['quantity']= data[i].itemQty;
            cart.add(locDish, id)
          }
          req.session['cart']=cart;
          const c = cart.getList();
          res.send(c)
        }else{
          res.send(sendStatus("Something went wrong", 1, false))
        }
      })
    }else{
      const cart = new Cart(req.session['cart']?req.session['cart']:{})
      const c = cart.getList();
      res.send(c)
    }
  };


  //This method is called when the req POST /api/update_cart is made along with the updated cart items details like quantity or removal of some items. If a user is signed in it takes help from a helper function updateUserCart(req, res, msg, data = false) like others to update the details.
  updateCart (req,res){
    const item = req.body;
    const cart = new Cart({});
    cart.update(item);
    req.session['cart']=cart;
    const success_msg = 'UPDATE_SUCCESS';
    if(!req.session['email']){
      res.send(sendStatus(success_msg, 1, false));
    }else{
      this.updateUserCart(req,res,success_msg);
    }
  };

  //delete item from cart
  deleteItem(req,res){
    try{
      const product=Dishes.findByIdAndDelete(req.params.id)
      if(!product){
        throw new UnAuthorizedError('Product not found')
      }
      res.status(200).json({
        status: 'success',
        message:'Item has been deleted'
      })
    }catch(err){
      res.status(500).json({message:err.message})
    }
  };

  //create product review
  productReview(req,res) {
    try{
    const {rating, comment} = req.body
    const product = Dishes.findById({_id:req.params.id})
    if(product){
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        )
        if(alreadyReviewed){
            throw new UnAuthorizedError("Product review already exists")
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReview = product.reviews.length
        product.rating = product.reviews.reduce((acc,item) => item.rating + acc, 0)/product.reviews.length
         product.save()
        res.status(201).json({message:"Review added"})
    }else{
        throw new BadUserRequestError("Product review failed")
    }
}catch(err){
    res.status(500).json({message:err.message})
}
}


  addAddress(req,res){
    if(req.session['email']){
        req.session['address']=req.body;
        res.send(sendStatus('ADDED_ADDRESS', 1, false))
    }else{
        res.send(sendStatus('Nothing to add', 0, false))
    }
  };

  fetchAddress (req,res){
    if(req.session['email']){
        User.findOne({email: req.session['email']}, {address:1},(err,data)=>{
            if(err) res.send(err);
            else{
                console.log(data);
                data['status']=1;
                res.send(data);
            }
        })
    }else{
        res.send(sendStatus('Nothing to fetch', 0, false))
    }
  }


} 

module.exports = productController
