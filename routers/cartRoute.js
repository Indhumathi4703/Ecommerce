const express = require("express");
const Cart = require("../model/cart");
const Item = require("../model/item");
const Auth = require("../middleware/auth");

const router = express.Router();

//get cart items

router.get("/getCart", Auth, async (req, res) => {
  const owner = req.user._id;

  try {
    const cart = await Cart.findOne({ owner });
    if (cart && cart.items.length > 0) {
      res.status(200).json({status:true,msg:"gett all cart",cart});
    } else {
      res.status(400).json({status:false,msg:"data not found"});
    }
  } catch (error) {
    res.status(500).send();
  }
});

//add cart
router.post("/createCart", Auth, async (req, res) => {
  const owner = req.user._id;
  const { itemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ owner });
    const item = await Item.findOne({ _id: itemId });

    if (!item) {
      return res.status(404).send({ message: "Item not found" });
    }

    const price = item.price;
    const name = item.name;

    if (cart) {
      const itemIndex = cart.items.findIndex((cartItem) => cartItem.itemId == itemId);

      if (itemIndex > -1) {
        let cartItem = cart.items[itemIndex];
        cartItem.quantity += quantity;
        cart.bill = cart.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
        cart.items[itemIndex] = cartItem;
      } else {
        cart.items.push({ itemId, name, quantity, price });
        cart.bill = cart.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
      }

      await cart.save();
      res.status(200).send(cart); 
    } else {
      const newCart = await Cart.create({
        owner,
        items: [{ itemId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

//delete item in cart
router.post("/deleteCart", Auth, async (req, res) => {
  const ownerId = req.user._id;
  const itemId = req.body.itemId;

  try {
    let cart = await Cart.findOne({ owner: ownerId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => String(item.itemId) === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    const item = cart.items[itemIndex];
    cart.bill -= item.quantity * item.price;
    if (cart.bill < 0) {
      cart.bill = 0;
    }
    cart.items.splice(itemIndex, 1);
    cart.bill = cart.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
    cart = await cart.save()

    res.status(200).json({ success: true, message: "Item deleted successfully", cart });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/updateCart", Auth, async (req, res) => {
  const ownerId = req.user._id;
  const itemId = req.body.itemId;
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ owner: ownerId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => String(item.itemId) === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    const item = cart.items[itemIndex];

    item.quantity = quantity;

    cart.bill = cart.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);

    cart = await cart.save();

    res.status(200).json({ success: true, message: "Item quantity updated successfully", cart });
  } catch (error) {
    console.error("Error updating item quantity in cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
