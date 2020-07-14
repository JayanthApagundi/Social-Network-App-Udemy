//handle json web tokens for authentication
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// @route GET api/auth
// @desc Test Route
// @access Public
//router.get('/', auth, (req, res) => res.send('Auth Route'));
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(501).send('Server Error !');
  }
});

module.exports = router;
