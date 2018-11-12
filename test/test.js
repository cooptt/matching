let express = require('express'),router = express.Router();
const analizer = require('../index').analizer;



router.get('/ping', (req,res)=>{
  return res.json({message:'ping'});
})


router.post('/addVideoGame',(req,res)=>{
    let parameters = req.body;
    analizer.addVideoGame(parameters.name,parameters.path);
    return res.json({message:'ok'})
})
module.exports = router;
