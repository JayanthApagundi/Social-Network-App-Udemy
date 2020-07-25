//handle json web tokens for authentication
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config'); //for JWT
const bcrypt = require('bcryptjs');

// @route GET api/auth
// @desc Test Route
// @access Public
//router.get('/', auth, (req, res) => res.send('Auth Route'));
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
    //res.send('Worked');
  } catch (err) {
    console.error(err.message);
    res.status(501).send('Server Error !');
  }
});

// @route POST api/auth
// @desc Authenticate User and Get token
// @access Public
router.post(
  '/',
  [
    check('email', 'Enter valid email').isEmail(),
    check('password', 'password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //To check the data entries via. postman
    }
    //console.log(req.body);

    //To see if the user exists- get users gravator, Encrypt password and then return jsonwebtoken
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const match = await bcrypt.compare(password, user.password);

      if(!match){
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      ); //go to default.json in config n make the changes accordingly

      //res.send('User Registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
