const express = require('express')
const Item = require('../model/item')
const Auth = require('../middleware/auth')
const item = require('../model/item')

const router = express.Router()

//fetch all items
router.get('/items', async(req, res) => {
    try {
        const items = await Item.find({})
        res.status(200).send(items)
    } catch (error) {
        res.status(400).send(error)
    }
})

//fetch an item
router.get('/items/:id', async(req, res) => {
    try{
        const item = await Item.findOne({_id: req.params.id})
        if(!item) {
            res.status(404).send({error: "Item not found"})
        }
        res.status(200).send(item) 
    } catch (error) {
        res.status(400).send(error)
    }
})

//create an item
router.post('/items/create',Auth, async(req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            owner: req.user._id
        })
        await newItem.save()
        res.status(201).send(newItem)
    } catch (error) {
        console.log({error})
        res.status(400).send({message: "error"})
    }
})

//update an item:id

router.post('/items/update', Auth, async (req, res) => {
    const itemId = req.query.id;

    const updates = Object.keys(req.body);
    try {
        const item = await Item.findOneAndUpdate({ _id: itemId });

        if (!item) {
            return res.status(404).send({ error: 'Item not found' });
        }

        updates.forEach((update) => item[update] = req.body[update]);
        await item.save();
        res.send(item);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' }); 
    }
});


//delete item
router.post('/items/delete', Auth, async(req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete( {_id: req.body.id} )
        console.log("deletedItem", deletedItem)
        if(!deletedItem) {
            return res.status(404).send({error: "Item not found"})
        }
        res.send({deletedItem})
    } catch (error) {
        res.status(400).send(error) 
    }
})


module.exports = router