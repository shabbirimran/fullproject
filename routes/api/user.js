const express=require("express");
const router=express.Router();
const { check, validationResult } = require('express-validator');
const jwt=require("jsonwebtoken");
const gravatar=require("gravatar");
const bcryptjs= require('bcryptjs')
const config=require('config');
const User=require("../../model/User");
const auth=require('../../middlewear/auth');
//router Post/api/user
// @desc register user
//@access Public

// router.post('/',[
// check("name","name is required").not().isEmpty(),
// check("email","pleae enter email").isEmail(),
// check("password","Enter valid password").isLength({min: 6}),
// ]
// ,async(req,res)=>{
//     const error=validationResult(req);
//     if(!error.isEmpty()){
//         return res.status(400).json({ error: error.array() });

//     }
//     const{ name,email,password}=req.body;
        
//         try{
//             let user=await User.findOne({email});
//             if(user){
//                 return res.status(400).json({ err: [{ msg: 'user is already exists' }] });

//             }
//             //avatar
//             const avatar=gravatar.url(email,{
//                 s:"200",
//                 r:"pg",
//                 d:"mm",
//             });
//             user= new User({
//                 name,email,avatar,password

//             });
//             //encrypt password
//             const salt= await bcryptjs.genSalt(10);
//             user.password =await bcryptjs.hash(password,salt)

//             await user.save();

//         }catch(err){
//             console.log(err.message);
//             res.status(400).send("server error")
//         }


// });
// module.exports = router;

router.post(
    '/',
    [
      check('name', 'Name is require').not().isEmpty(),
      check('email', 'please include valid email').isEmail(),
      check('password', 'Please enter a password with 6 0r more character').isLength({ min: 6 }),
    ],
    async (req, res) => {
      // console.log(req, 'Chekciong');
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
  
      //See if user exists
  
      const { name, email, password } = req.body;
      console.log(req.body, 'req.body');
      try {
        let user = await User.findOne({ email });
        console.log(user, 'user');
        if (user) {
          return res.status(400).json({ err: [{ msg: 'user is already exists' }] });
        }
  
        //get users avatar
  
        const avatar = gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        });
        user = new User({
          name,
          email,
          avatar,
          password,
        });
        console.log(user, 'newuser');
        console.log(password, 'new user');
        // encrypt password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);
        console.log(user.password, 'user.password');
        await user.save();
        console.log(user);
        // res.json(user);
        //return jsonwebtokeny
        // const payload = {
        //   user: {
        //     id: user.id,
        //   },
        // };
  
        // jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        //   if (err) throw err;
        //   res.json({ token });
        // });
        // console.log(user, 'payload');
        const payload={
                 user:{
                id:user.id


            }

        }
        jwt.sign(payload,config.get('secret'),{expiresIn:3600000},(error,token)=>{
            if(error) throw error;
            res.json({token});


        });


      } catch (err) {
        console.log(err.message);
        res.status(420).send('server error');
      }
    }
  );
  
  module.exports = router;
  