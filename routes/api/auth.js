const express=require('express');
const router=express.Router();
const jwt=require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const bcryptjs= require('bcryptjs')
const config=require('config');
const User=require("../../model/User");

router.post(
  '/',
  [check('email', 'please input valid email').isEmail(), check('password', 'please write valid password').exists()],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      console.log(err.message);
      res.status(500).send('error');
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, config.get('secret'), { expiresIn: '2 hour' }, (error, token) => {
        if (error) throw error;
        res.json({ token });
      });
    } catch (err) {
      res.status(400).send({ err: 'server error' });
    }
  }
);
module.exports = router;
