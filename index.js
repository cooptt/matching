const express = require('express')        //  library to create apps
const logger = require('morgan')          // logs every endpoint
const ejs = require('ejs')                // embedded javascript
const bodyParser = require('body-parser') // to parse the body in the request
const admin = require('firebase-admin') // service firebase
//const analizer = require('./src/analizer')  //// analizer
const Analizer = require('./analizer/analizer').Analizer;




const analizer = new Analizer();
analizer.loadCatalogueFromFolders('./views/catalogue');

const app = express()

// server firebase
// firebase > settings >> Service accounts
const serviceAccount = require('./auth-99adf-firebase-adminsdk-navvq-246070dc0d.json')

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://auth-99adf.firebaseio.com"
});
// config
let port = process.env.PORT || 8080


// engine template
app.set('view engine','ejs') // instead of use normal html, use ejs
app.set('views',__dirname + '/views') // static files (public folder)



//middlewares
app.use(bodyParser.json()) //parse the input to json
app.use(bodyParser.urlencoded({extended:false}))
app.use(logger('dev')) //logs
app.use(express.static('views')) // static files (public folder)


      // id token
      // check if the user is logged in
      // if it is, attach to the request
      // else ...
const checkAuth = (request,response,next) =>{
    if (!(request.headers && request.headers.authorization)) {
     return res.status(400).json({
       status: 'not logged in'
     });
   }

   let idToken = request.headers.authorization

   admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) { 
      request.loginServiceId = decodedToken.uid;
      next()

    }).catch(function(error) {
        console.log(error)
        return response.status(500).json({
            status: 'invalid token'
        });
    });
}

const tmpAuth = (request, response, next) => {
  // process request.authorization
  request.loginServiceId = request.headers.authorization;
  next();
}



app.get('/',(request,response)=>{
  response.render('home.ejs')
})






app.get('/getUserProperties',  (request, response) => {
    let msg = {};
    msg.action = 'Get User Properties'
    let userId = parseInt(request.query.userId);

    let isValid = true;

    if(isValid && analizer.userIdExists(userId)===false ){
      isValid = false;
      msg.data = 'Invalid UserId'
    }

    if(isValid){
      msg.data = analizer.getUserProperties(userId);
    }
    
    response.json(msg);
})


app.get('/getCatalogue',  (request, response) => {
    let msg = {};
    msg.action = 'Get Catalogue';
    msg.data = analizer.getCatalogue();
    response.json(msg);
})


app.get('/getUserSellList', (request, response) => {
    let msg = {};
    msg.action = 'Get User Sell List';
    let userId = parseInt(request.query.userId);

    let isValid = true;

    if(analizer.userIdExists(userId)===false){
      isValid = false;
      msg.data = 'Invalid UserId'
    }

    if(isValid){
      msg.data = analizer.getUserSellList(userId);
    }

    response.json(msg);
})


app.get('/getUserBuyList', (request, response) => {
    let msg = {};
    msg.action = 'Get User Buy List';
    let userId = parseInt(request.query.userId);

    let isValid = true;

    if(analizer.userIdExists(userId)===false){
      isValid = false;
      msg.data = 'Invalid UserId'
    }

    if(isValid){
      msg.data = analizer.getUserBuyList(userId);
    }

    response.json(msg);
})









app.post('/signin', (request, response) => {
    let msg = {};
    msg.action = 'Sign in';
    let loginServiceId = parseInt(request.query.loginServiceId )

    if( analizer.loginServiceIdExists(loginServiceId)===false ){
      analizer.addUser(loginServiceId);
      msg.res = "New user registered Succesfully";
    }else{
      msg.res = "User already registered"
    }
    msg.data = analizer.getUserProperties( analizer.getUserIdFromLoginServiceId(loginServiceId) );
    response.json(msg);
})


app.post('/updateUserProperties', (request, response) => {
    let msg = {};
    msg.action = 'Update User Properties ';
    let userId = parseInt(request.query.userId);
    let properties = request.body;

    let isValid = true;

    if( analizer.userIdExists(userId)===false ){
      isValid = false;
      msg.data = "Invalid UserId";
    }

    if(isValid){
      analizer.updateUserProperties(userId, properties);
      msg.data = 'User Properties updated'
    }

    response.json(msg);
})




app.post('/addSellOffer', (request, response) => {
    let msg = {};
    msg.action = 'Add sell offer'
    let userId = parseInt(request.query.userId);
    let videoGameId = parseInt(request.query.videoGameId);
    let price = parseFloat(request.query.price).toFixed(2);

    let isValid = true;

    if(isValid && analizer.userIdExists(userId)===false){
      isValid = false;
      msg.data = 'Invalid UserId';
    }

    if(isValid && analizer.videoGameIdExists(videoGameId)===false){
      isValid = false;
      msg.data = 'Invalid VideoGameId';
    }

    if(isValid){
      analizer.addSellOffer(userId, videoGameId, price);
      msg.data = 'Offer Added';
    }
    response.json(msg);
})


app.post('/addBuyOffer', (request, response) => {
    let msg = {};
    msg.action = 'Add buy offer'
    let userId = parseInt(request.query.userId);
    let videoGameId = parseInt(request.query.videoGameId);
    let price = parseFloat(request.query.price).toFixed(2);

    let isValid = true;

    if(isValid && analizer.userIdExists(userId)===false){
      isValid = false;
      msg.data = 'Invalid UserId';
    }

    if(isValid && analizer.videoGameIdExists(videoGameId)===false){
      isValid = false;
      msg.data = 'Invalid VideoGameId';
    }

    if(isValid){
      analizer.addBuyOffer(userId, videoGameId, price);
      msg.data = 'Offer Added';
    }
    response.json(msg);
})







// callback
app.listen(port,()=>{
  console.log(`Running in the port ${port}`)
})





/*
// to save an user
app.post('/user/signin',(request,response)=>{
    let parameters = request.body;

    if(analizer.findUser(parameters.userId)){
        return response.json({'status':'ok'});
    }else{
        analizer.addUser(parameters.userId,parameters.name);
        return response.json({message:'user added'})
    }
})

*/




/*
app.get('/user/videogames/buy/:id', (request,response)=>{
    let id = request.params.id
    let user = analizer.findUser(id)
    if(user == undefined)
        return response.json([])

    let videogames = analizer.queryvideoGamesToBuy(id)
    return response.json(videogames);
});



// id

app.get('/user/videogames/sell/:id', (request,response)=>{
    let id = request.params.id
    let user = analizer.findUser(id)
    if(user == undefined)
        return response.json([])
    let videogames = analizer.queryvideoGamesToSell(id)
    return response.json(videogames);
});



app.post('/user/videogames/sell',checkAuth,(request,response)=>{
    // params (name  video game, and price )

    let parameters = request.body;
    let name = parameters.name;
    let price = parameters.price;
    let userId = request.id;

    analizer.addVideoGameToSell(name,price,userId)
    return response.json({message:'videogame added'})
})


app.post('/user/videogames/buy',checkAuth,(request,response)=>{
    // params (name  video game, and price )
    let parameters = request.body;
    let name = parameters.name;
    let price = parameters.price;
    let userId = request.id;
    analizer.addVideoGameToBuy(name,price,userId)
    return response.json({message:'videogame added'})
})


*/










