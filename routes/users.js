var express = require('express');
var router = express.Router();

require('../models/connection');
const { checkBody } = require('../modules/checkBody');
const User = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

const API_key_location = process.env.API_key_location;



//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-SIGNUP+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-//

//Route post Classique
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'password', 'email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        username: req.body.username,
        password: hash,
        token: uid2(32),
        email: req.body.email,
        avatar: "https://www.zupimages.net/up/23/09/mebb.jpg",
        description: "Whats new ?",
        canFavorite: true,
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token, username: newDoc.username });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});

//Route post GOOGLE AUTH
router.post('/signupGoogle', (req, res) => {
  if (!checkBody(req.body, ['username', 'email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ username: req.body.username }).then(data => {
    if (data === null) {
      const newUser = new User({
        username: req.body.username,
        token: uid2(32),
        email: req.body.email,
        avatar: "https://www.zupimages.net/up/23/09/mebb.jpg",
        description: "Whats new ?"
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});


//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-SIGNIN+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-//

//Création de la route post
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  
  User.findOne({ username: req.body.username }).then(data => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username });
    } else {
      res.json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

//Création de la route post via connexion google
router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['username'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username }).then(data => {
    if (data === null){
      res.json({ result: true, token: data.token });
    }
    else{
      res.json({ result: false, error: 'User not found' });
    }
  });
});


//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-GET BY TOKEN+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-//

//Création route get pour le profil utilisateur
router.get('/profile/:token',(req,res)=>{
User.findOne({token:req.params.token}).then(data=>{
  if (data){
    res.json({result:true, profile: data});
  }else{
    res.json({result:false, error:'Profile not found'});
  }
})
});


//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-MODIFICATION D'UN UTILISATEUR+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-//

router.put('/edit', (req, res) => {

  if (!checkBody(req.body, ['token'])) {
    res.json({ result: false, error: 'No token' });
    return;
  }

  User.findOne({token: req.body.token}).then(data => {
    if(data === null){
      res.json({result: false, error:"User not find"})
      return;
    }

    if(req.body.username){
      data.username = req.body.username;
    }

    if(req.body.email){
      data.email = req.body.email;
    }

    if(req.body.description){
      data.description = req.body.description;
    }

    if(req.body.avatar){
      data.avatar = req.body.avatar;
    }

    if(req.body.password){
      data.password = bcrypt.hashSync(req.body.password, 10);
    }


    data.save().then(updateUser => {
      res.json({result: true, user: updateUser });
    });
  });
});


/* Route check if user is in Users and can Favorite projects */
router.get('/canFavorite/:token', (req, res) => {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true, canFavorite: data.canFavorite });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});


router.get('/location/:locationName', async (req, res) => {
  const { locationName } = req.params;

  const response = await fetch(`http://api.positionstack.com/v1/forward?access_key=2d8531b40e3247ef4cefc88994fd86e0&query=${locationName}&limit=1`);
  const data = await response.json();

  const location = {
    lat: data.data[0].latitude,
    lon: data.data[0].longitude,
    country: data.data[0].country,
    name: data.data[0].name,
  };

  res.json(location);
});


module.exports = router;
