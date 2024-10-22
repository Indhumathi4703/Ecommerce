const express = require('express');
const router = express.Router();
const User = require('../model/user')
const Auth = require('../middleware/auth');
const user = require('../model/user');
const { token } = require('morgan');


//signup
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({status:true,user})
    } catch (error) {
        res.status(400).send(error)
    }

})

//login

router.post('/users/login', async (req, res) => {
  try {
      const data = await User.findByCredentials(req.body.email, req.body.password);
      
      if (!data) {
          return res.status(404).json({ status: false, error: 'User not found' });
      }

      const token = await data.generateAuthToken();
      res.status(200).json({ status: true, data,token });
  } catch (error) {
      res.status(500).json({ status: false, error: 'Internal Server Error' });
  }
});


//logout
router.post('/users/logout',Auth, async (req, res) => {
   
    try {
       req.user.tokens =  req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })

        await req.user.save()
        res.status(200).send({status:true,msg:"user logout successfully"})
    } catch (error) {
        res.status(500).send({status:false})
    }
})

//Logout All 
router.post('/users/logoutAll', Auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()        
    }
})
module.exports = router