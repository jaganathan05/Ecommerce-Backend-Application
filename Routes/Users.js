const express = require('express');
const router = express.Router();
const User_Controller = require('../Controller/User_Controller')
const user_auth = require('../Middleware/UserAuth')

 
// router.post('/login',Admin_Controller.PostLogin)

router.post('/login',User_Controller.PostLogin)
router.post('/signup', User_Controller.Signup)

 router.get('/products', User_Controller.FetchProducts)

 router.get('/product/:prodId',User_Controller.fetchsingleproduct)
 router.post('/user/cart/update', user_auth.user_authentication,User_Controller.updateCartItems)

 router.get('/user/cart',user_auth.user_authentication , User_Controller.fetchcartItems);

 router.post('/user/place-order',user_auth.user_authentication, User_Controller.placeOrder)

module.exports=router;