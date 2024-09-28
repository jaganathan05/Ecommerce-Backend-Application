const Product = require('../Models/Products')
const Order = require('../Models/Orders')
const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.FetchProducts = async(req,res,next)=>{

        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch products', error });
        }
    }



exports.fetchsingleproduct = async(req,res,next)=>{
        try {
            const productId = req.params.prodId; 
            const product = await Product.findById(productId); 
            if (product) {
                res.status(200).json(product);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch product', error });
        }
   
}

exports.Signup = async(req,res,next)=>{
    const { name, email, phoneno, password } = req.body;

  try {

    bcrypt.hash(password,10,async(err,result)=>{
        if(result){
            const newUser = new User({ name, email, phoneno, password:result , address:[] , cartItems:[] });
            await newUser.save();
            res.status(201).json({ success: true, message: 'Signup successful' });
        }
        
    })
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
}

exports.PostLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email is', email,password);

        const user = await User.findOne( { 'email': email } );

        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result === true) {
                return res.status(200).json({
                    success: true,
                    message: "Logged In Successfully",
                    idToken: generateAccesstoken(user._id, user.email)
                });
            } else {
                return res.status(401).json({success:false,message: 'User not authorized'});
            }
        } else {
            return res.status(404).send({success:false,message:'User not Found'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

function generateAccesstoken(id,email){
    const secretKey = process.env.Token_SecretKey;
    console.log(secretKey);

    return jwt.sign({userId : id , Email:email},secretKey)
}

 exports.updateCartItems = async(req,res)=>{
    try {
        const { cartitems } = req.body;
        console.log(cartitems);

        const user = await User.findById(req.user._id);

    if (!user) {
      throw new Error('User not found');
    }
    //console.log(user)    
    user.cartItems = cartitems.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));

   
    await user.save();

  
    return { success: true, message: 'Cart updated successfully', cartItems: user.cartItems };
  } catch (error) {
   
    console.error('Error updating cartItems:', error.message);
    return { success: false, message: error.message };
  }

}

exports.fetchcartItems =async(req,res)=>{
//console.log(req.user)
if(req.user){
    const user = await User.findById(req.user._id).populate('cartItems.product');
   // console.log(user.cartItems)
    return res.json({ success : true , message : 'cart fetched successfully' , cartItems : user.cartItems})
}
else{
    return { success: false, message: error.message };
}


}



exports.placeOrder = async (req, res) => {
    try {
      const { address } = req.body;  
  
      if (!address) {
        return res.status(400).json({ success: false, message: 'Address is required to place an order' });
      }
  
      const user = await User.findById(req.user._id).populate('cartItems.product');
  
      if (!user || user.cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'No items in cart' });
      }
  
      const orderProducts = user.cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));
  
      const totalAmount = user.cartItems.reduce((acc, item) => acc + item.product.saleprice * item.quantity, 0);
  
      // Create a new order
      const order = new Order({
        user: req.user,
        products: orderProducts,
        totalAmount,
        address,  
        paymentMethod: 'COD',  
        status: 'Pending'
      });
      console.log(order)
  
      await order.save();
  
      // Clear user's cart after placing the order
      user.cartItems = [];
      await user.save();
  
      return res.json({ success: true, message: 'Order placed successfully', order });
    } catch (error) {
      console.error('Error placing order:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to place order' });
    }
  };
  