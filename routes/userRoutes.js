const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');


// models
const Product = require('../models/product');
const Cart = require('../models/cart');


const createCart = async(userId)=>{

    const cart = new Cart({
        notes:" ",
        totalPrice:0,
        quantity:0,
        products:[],
        createdBy:userId,
    });
    await cart.save()
    .then(result=>{console.log("Cart added");})
    .catch(err=>{console.log(err);});

}; 

router.post('/',async(req,res)=>{
 
    const user = new User(
        {
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            phoneNumber : req.body.phoneNumber,
            accountType : req.body.accountType,   
        }
     );
     await user.save()
     .then(result=>{
         console.log("User Added");
         res.json(result);
         createCart(result._id);

     })
     .catch(err=>{
         console.log(err);
         res.send("Error");
     });
     
});


router.patch('/:userId',async(req, res) => {

    // remove( : ) from id
    const id = req.params.userId.slice(1);
    await User.findByIdAndUpdate(id, req.body)
    .then((result) => {
        if (!result) {
            console.log("Error");
            res.status(404).send("id not found");
        }
        res.send(req.body);
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    })
})


router.delete('/:userId',async(req,res)=>{
    const id = req.params.userId.slice(1);
    await User.findByIdAndDelete(id)
    .then(result=>{
        console.log('user deleted');
        
            Cart.findOne({createdBy:id}).then(result=>{
                result.deleteOne();
                console.log("cart Deleted");
            }).catch(err=>{
            console.log("Cart Deleted Error");
        });
        res.send('User Deleted');
    })
    .catch(err=>{
        console.log(err);
        res.status(400).send();
    });
});


router.post('/:userId/carts/:productId',async (req,res)=>{
    
    try{
        const cartId = mongoose.Types.ObjectId(req.params.userId.slice(1));
        const productId = mongoose.Types.ObjectId(req.params.productId.slice(1));
        
        const product = await Product.findOne({_id:productId});
        if(!product){
            res.send("Product not found");
        }else{   
             const cart = await Cart.findOne({createdBy:cartId})
             if(!cart){
                res.send("cart not found");
             }else{
                // if product exists -> update
                let found = false;
                let CartTotalPrice = 0;
                cart.products.forEach((cartProduct)=>{
                    if(cartProduct.productId.equals(productId)){
                        found=true;
                        cartProduct.quantity   = req.body.quantity;
                        cartProduct.totalPrice = product.price*req.body.quantity;
                    }
                    CartTotalPrice+=cartProduct.totalPrice;
                });

                // else -> push new product;
                if(!found){
                    cart.products.push({
                        productId:productId,
                        productName:product.name,
                        quantity:req.body.quantity,
                        totalPrice:product.price*req.body.quantity
                    });
                    CartTotalPrice+=product.price*req.body.quantity;
                }
                cart.totalPrice=CartTotalPrice;
                await cart.save();    
                res.json(cart);
             }
        }
    }catch{
        res.status(400).send("invalid Id");
    }
});


router.get('/:userId/cart',(req,res)=>{
    const userid = mongoose.Types.ObjectId(req.params.userId.slice(1));
    Cart.findOne({createdBy:userid})
    .then(result=>{
        res.json(result);
    })
    .catch(err=>{
        res.send(err);
    });
});

router.delete('/:userId/carts/:productId',async(req,res)=>{
    const userid = req.params.userId.slice(1);
    const productId = req.params.productId.slice(1);
    
    await Cart.findOne({createdBy:userid})
    .then(async (result)=>{
        await result.products.forEach(product=>{
            if(product.productId.equals(productId)){
                result.products.pull(product);
                console.log('item deleted');
                result.save();
                res.json(result);
            }
        });
       
    })
    .catch(err=>{
        res.send(err);
    });

});


module.exports = router;