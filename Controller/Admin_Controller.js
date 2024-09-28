const Admins = require('../Models/Admin')
const Product = require('../Models/Products')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const Order = require('../Models/Orders')
require('dotenv').config();


exports.PostLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Email is', email,password);

        const user = await Admins.findOne( { 'email': email } );

        
        

        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result === true) {
                return res.status(200).json({
                    success: true,
                    message: "Logged In Successfully",
                    token: generateAccesstoken(user._id, user.email)
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
    const secretKey = process.env.Admin_Token_Key;
    console.log(secretKey);

    return jwt.sign({userId : id , Email:email},secretKey)
}

exports.AddProduct= async (req,res,next)=>{

    const { name, description, mrpprice, saleprice, offer, quantity, remainquantity, category, subcategory, imageurl } = req.body;

    //console.log( name, description, mrpprice, saleprice, offer, quantity, remainquantity, category, subcategory, imageurl)

    if(req.admin){
        const newProduct = new Product({
            name,
            description,
            mrpprice,
            saleprice,
            offer,
            quantity,
            remainquantity,
            category,
            subcategory,
            imageurl
          });
        
          try {
            const savedProduct = await newProduct.save();
            res.status(201).json({ message: 'Product added successfully', product: savedProduct });
          } catch (error) {
            res.status(500).json({ message: 'Failed to add product', error });
          }
    }
    
    
}

exports.FetchProducts = async(req,res,next)=>{

    if(req.admin){
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch products', error });
        }
    }

}

exports.fetchsingleproduct = async(req,res,next)=>{
    if(req.admin){
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
    else {
        res.status(403).json({ message: 'Unauthorized access' });
    }
}

exports.editProduct = async(req,res,next)=>{
        if (req.admin) {
            try {
                const productId = req.params.prodId;
                const {
                    name, description, mrpprice, saleprice, offer, quantity, remainquantity, category, subcategory, imageurl
                } = req.body;
    
                const updatedProduct = await Product.findByIdAndUpdate(
                    productId,
                    {
                        name,
                        description,
                        mrpprice,
                        saleprice,
                        offer,
                        quantity,
                        remainquantity,
                        category,
                        subcategory,
                        imageurl
                    },
                    { new: true } 
                );
    
                if (updatedProduct) {
                    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
                } else {
                    res.status(404).json({ message: 'Product not found' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Failed to update product', error });
            }
        } else {
            res.status(403).json({ message: 'Unauthorized access' });
        }
    
}

exports.deleteProduct = async (req, res, next) => {
  if (req.admin) {
    try {
      const productId = req.params.prodId;
      const result = await Product.findByIdAndDelete(productId);
      if (result) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete product', error });
    }
  } else {
    res.status(403).json({ message: 'Unauthorized access' });
  }
};

exports.fetchorders=async(req,res)=>{

            try{
                if(req.admin){
                    const Orders = await Order.find({})
    
                    if(Orders){
                        return res.json({message:'order fetched successfully', orders:Orders})
                    }
                }
            }
            catch(err){
                console.log(err)
            }
           
}



exports.updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;

  try {
    if(req.admin){
        const order = await Order.findById(orderId);

        if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found' });
        }
    
        
        order.status = status;
        await order.save(); 
    
        res.status(200).json({
          success: true,
          message: 'Order status updated successfully',
          order, 
        });
    }
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
