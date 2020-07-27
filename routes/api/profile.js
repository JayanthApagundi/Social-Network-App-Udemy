//handle updating,fetching,adding profile sections
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const { compare } = require('bcryptjs');

// @route GET api/profile
// @desc Test Route
// @access Public
//router.get('/', (req, res) => res.send('Profile Route'));

// @route GET api/profile/me
// @desc get the user profile
// @access Private with ID
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);
    //Populate- Can get attributes from other model

    if (!profile) {
      return res.status(400).json({ msg: 'No profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/profile
// @desc to create/update user profiles
// @access Private
router.post(
  '/',
  [
    auth,
    [check('status', 'Status is required ').not().isEmpty()],
    [check('skills', 'Skills are required ').not().isEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube,
    } = req.body;

    //Build profile objects
    const profileFields = {};

    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      //Create
      profile = new Profile(profileFields);
      await profile.save();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    //console.log(profileFields.skills);
    //res.send('hello');
  }
);

// @route GET api/profile
// @desc to get all profiles
// @access Public

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error ');
  }
});

// Search user profile via. user id
// @route GET api/profile/user/:user_id
// @desc get profile by user_id
// @access Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.find({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      res.status(400).json({ msg: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error ');
  }
});

// @route DELETE api/profile
// @desc Delete profile, user, and posts related to the user
// @access Private

router.delete('/', auth, async (req, res) => {
  try {
    //to-do Remove posts related to user
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User Deleted' }); // Re-check
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error ');
  }
});

// @route PUT/POST api/profile/experience
// @desc Add profile experience
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is Required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Destructing
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    //Update/changes in experiences should be seen later
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experiences.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route DELETE api/profile/experience/:exp_id
// @desc Delete profile experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    //Get the index
    const RemoveIndex = profile.experiences
      .map(item => item.id)
      .indexOf(req.params.exp_id);
    profile.experiences.splice(RemoveIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
