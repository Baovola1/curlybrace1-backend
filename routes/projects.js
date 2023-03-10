var express = require("express");
var router = express.Router();

require("../models/connection");
const Project = require("../models/projects");
const { checkBody } = require("../modules/checkBody");

//CREATE A PROJECT
router.post("/create", (req, res) => {
  //Check required info null
  if (
    !checkBody(req.body, ["title", "shortDescription", "description", "user"])
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const newProject = new Project({
    user: req.body.user,
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    description: req.body.description,
    banner: req.body.banner,
    image: req.body.image,
    location: {
      name: req.body.name,
      lat: req.body.lat,
      lon: req.body.lon,
      country: req.body.country,
    },
    tags: {
      art: req.body.art,
      gaming: req.body.gaming,
      food: req.body.food,
      finance: req.body.finance,
      health: req.body.health,
      science: req.body.science,
      sport: req.body.sport,
    },
    isPaid: req.body.isPaid,
    isHelp: req.body.isHelp,
    languages: {
      javascript: req.body.javascript,
      python: req.body.python,
      cplusplus: req.body.cplusplus,
      php: req.body.php,
      ruby: req.body.ruby,
      react: req.body.react,
    },
    level: req.body.level,
    isPro: req.body.isPro,
    isStarted: req.body.isStarted,
    isComplete: false,
  });

  newProject.save().then(() => {
    res.json({ result: true });
  });
});


//Route Find Project by id
router.get('/project/:id',(req,res)=>{
  const id = req.params.id;
  Project.findById(id).then(data=>{
    if (data){
      res.json({result:true, project: data});
    }else{
      res.json({ result: false, error: "No project found" });
    }
  })
});

//Route get pour trouver les projets
router.get('/',(req,res)=>{
  Project.find().then(data=>{
    if (data){
      res.json({result:true, projects: data});
    }else{
      res.json({ result: false, error: "No project found" });
    }
  })
});

//Route Find Project by user
router.get('/find/:user',(req,res)=>{
  const user = req.params.user;
  Project.find({ user: user }).then(data=>{
    if (data){
      res.json({result:true, projects: data});
    }else{
      res.json({ result: false, error: "No project found" });
    }
  })
});



//ATTENTION, PENSER à RENDRE CA INSENSIBLE A LA CASSE POUR LES LOCATION.NAME ET PROJECT NAME
router.get('/search', async (req, res) => {
  const { title, isPaid, isHelp, level, isPro, isStarted, isComplete, javascript, python, cplusplus, php, ruby, react, art, gaming, food, finance, health, science, sport, name } = req.query;

  const query = {};
  if (title) {
    query.title = title;
  }
  if (isPaid) {
    query.isPaid = isPaid;
  }
  if (isHelp) {
    query.isHelp = isHelp;
  }
  if (level) {
    query.level = level;
  }
  if (isPro) {
    query.isPro = isPro;
  }
  if (isStarted) {
    query.isStarted = isStarted;
  }
  if (isComplete) {
    query.isComplete = isComplete;
  }

  if (javascript) {
    query['languages.javascript'] = true;
  }
  if (python) {
    query['languages.python'] = true;
  }
  if (cplusplus) {
    query['languages.cplusplus'] = true;
  }
  if (php && php.toString() === "true") {
    query['languages.php'] = true;
  }
  if (ruby) {
    query['languages.ruby'] = true;
  }
  if (react) {
    query['languages.react'] = true;
  }

  if (art && art.toString() === "true") {
    query['tags.art'] = true;
  }
  if (gaming) {
    query['tags.gaming'] = true;
  }
  if (food) {
    query['tags.food'] = true;
  }
  if (finance) {
    query['tags.finance'] = true;
  }
  if (health) {
    query['tags.health'] = true;
  }
  if (science) {
    query['tags.science'] = true;
  }
  if (sport) {
    query['tags.sport'] = true;
  }

  if (name) {
    query['location.name'] = name;
  }
  Project.find(query)
  .then((data)=>{
    if(data){
      res.json({result:true, projects:data})
    }else{
      res.json({result:false,error:'result not found'});
    }
  })
});







module.exports = router;
