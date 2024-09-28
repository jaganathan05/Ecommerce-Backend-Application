const express = require('express');
const router = express.Router();
const Admin_Controller = require('../Controller/Admin_Controller')
const AdminAuthMiddleware = require('../Middleware/AdminAuth')
 
 router.post('/login',Admin_Controller.PostLogin)

 router.post('/add-product',AdminAuthMiddleware.admin_authentication , Admin_Controller.AddProduct);


 router.get('/products',AdminAuthMiddleware.admin_authentication , Admin_Controller.FetchProducts)

 router.get('/product/:prodId',AdminAuthMiddleware.admin_authentication,Admin_Controller.fetchsingleproduct)

 router.post('/edit-product/:prodId',AdminAuthMiddleware.admin_authentication,Admin_Controller.editProduct)

 router.delete('/product/:prodId', AdminAuthMiddleware.admin_authentication,Admin_Controller.deleteProduct);

 router.get('/orders',AdminAuthMiddleware.admin_authentication,Admin_Controller.fetchorders)

 router.put('/update-status',AdminAuthMiddleware.admin_authentication,Admin_Controller.updateOrderStatus)

module.exports=router;