const express = require('express')        //  library to create apps
const logger = require('morgan')          // logs every endpoint
const ejs = require('ejs')                // embedded javascript
const bodyParser = require('body-parser') // to parse the body in the request
const admin = require('firebase-admin') // service firebase
//const analizer = require('./src/analizer')  //// analizer
const Analizer = require('./analizer/analizer').Analizer;

const catalogue_path = './views/catalogue'

const analizer = new Analizer();


let args = process.argv;
if( args.length>2){
    let analizerType = args[2] ;
    if( analizerType==='cleardb' ){
        analizer.startPersistance();
        analizer.clearDatabase();
        analizer.loadCatalogueFromFolders(catalogue_path);
    } else if( analizerType==='loaddb' ) {
        analizer.startPersistance();
        analizer.loadDB();
    }
}

module.exports ={
  analizer // to Integration Tests
}






const app = express()

app.disable('etag');
// server firebase
// firebase > settings >> Service accounts
const serviceAccount = require('./auth-99adf-firebase-adminsdk-navvq-246070dc0d.json')

const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://auth-99adf.firebaseio.com"
});
// config
let port = process.env.PORT || 8080
//let port = 80


// engine template
app.set('view engine','ejs') // instead of use normal html, use ejs
app.set('views',__dirname + '/views') // static files (public folder)



//middlewares
//middlewares
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json()) //parse the input to json
app.use(bodyParser.urlencoded({extended:false}))
app.use(logger('dev')) //logs
app.use(express.static('views')) // static files (public folder)


let  testRoute = require('./test/test');
app.use('/tests/',testRoute);
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





/*
	/getUserProperties?userId=0

	{
        userId:0,
        loginServiceId:17,
        firstName:null,
        lastName:null,
        email:null
    }
*/
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

/*
	/getCatalogue

    [
        { videoGameId:0, title: 'God of War', image: 'god_of_war.jpg' },
        { videoGameId:1, title: 'Halo', image: 'halo.jpg' },
        { videoGameId:2, title: 'Call of Duty', image: 'catalogue/call_of_duty.jpg' } ]
*/
app.get('/getCatalogue',  (request, response) => {
    let msg = {};
    msg.action = 'Get Catalogue';
    msg.data = analizer.getCatalogue();
    response.json(msg);
})

/*
	/getUserSellList?userId=0

    [{
        offerId:0,
        videoGameId:0,
        title:"God of War",
        image:"god_of_war.jpg",
        price:300 },
    {
        offerId:1,
        videoGameId:1,
        title:"Halo",
        image:"halo.jpg",
        price:500 },
    {
        offerId:2,
        videoGameId:2,
        title:"Call of Duty",
        image:"call_of_duty.jpg",
        price:400 } ]
*/
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

	/*
		/getUserBuyList?userId=0

        [
            {
                offerId:0,
                videoGameId:0,
                title:"God of War",
                image:"god_of_war.jpg",
                price:300 },
            {
                offerId:1,
                videoGameId:1,
                title:"Halo",
                image:"halo.jpg",
                price:500 },
            {
                offerId:2,
                videoGameId:2,
                title:"Call of Duty",
                image:"call_of_duty.jpg",
                price:400 }
        ]
    */
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

	/*
		/getVideoGameSellList?videoGameId=0

        [{
            userId:0,
            loginServiceId:666,
            firstName:null,
            lastName:null,
            email:null,
            offerId:0,
            price:500
        } ]
    */
app.get('/getVideoGameSellList', (request, response) => {
    let msg = {};
    msg.action = 'Get VideoGame Sell List';
    let videoGameId = parseInt(request.query.videoGameId);

    let isValid = true;


    if(analizer.videoGameIdExists(videoGameId)===false){
      isValid = false;
      msg.data = 'Invalid VideoGameId'
    }

    if(isValid){
      msg.data = analizer.getVideoGameSellList(videoGameId);
    }

    response.json(msg);
})


/*
	/getVideoGameBuyList?videoGameId=1

    [{
        userId:0,
        loginServiceId:666,
        firstName:null,
        lastName:null,
        email:null,
        offerId:0,
        price:700
    }]
*/
app.get('/getVideoGameBuyList', (request, response) => {
    let msg = {};
    msg.action = 'Get VideoGame Buy List';
    let videoGameId = parseInt(request.query.videoGameId);

    let isValid = true;


    if(analizer.videoGameIdExists(videoGameId)===false){
      isValid = false;
      msg.data = 'Invalid VideoGameId'
    }

    if(isValid){
      msg.data = analizer.getVideoGameBuyList(videoGameId);
    }

    response.json(msg);
})

/*
	/getNotifications?userId=0

    [ { userId: 1,
        loginServiceId: 17,
        firstName: null,
        lastName: null,
        email: null,
        title: 'Halo',
        image: 'halo.jpg',
        price: 600,
        type: 0 } ]
*/
app.get('/getNotifications', (request, response) => {
    let msg = {};
    msg.action = 'Get Notifications';
    let userId = parseInt(request.query.userId);

    let isValid = true;


    if(analizer.userIdExists(userId)===false){
      isValid = false;
      msg.data = 'Invalid UserId'
    }

    if(isValid){
      msg.data = analizer.getNotifications(userId);
    }

    response.json(msg);
})

/*
    Get all the offers in the system
	/getOffersProperties?userId=0

	[ { offerId: 0,
	    userId: 0,
	    videoGameId: 0,
	    price: 500,
	    type: 1,
	    title: 'Halo',
	    image: 'halo.jpg',
	    loginServiceId: 16,
	    firstName: null,
	    lastName: null,
	    email: null },
	  { offerId: 2,
	    userId: 0,
	    videoGameId: 0,
	    price: 700,
	    type: 1,
	    title: 'Halo',
	    image: 'halo.jpg',
	    loginServiceId: 16,
	    firstName: null,
	    lastName: null,
	    email: null } ]
*/
app.get('/getOffersProperties', (request, response) => {
    let msg = {};
    msg.action = 'Get Offer Properties';
    let userId = parseInt(request.query.userId);

    let isValid = true;


    if(analizer.userIdExists(userId)===false){
      isValid = false;
      msg.data = 'Invalid UserId'
    }

    if(isValid){
      msg.data = analizer.getOffersProperties(userId);
    }

    response.json(msg);
})

/*
	/getRankedUsers?userId=0

	[ { userId: 2,
	    loginServiceId: 18,
	    firstName: null,
	    lastName: null,
	    email: null,
	    matches: 4 },
	  { userId: 3,
	    loginServiceId: 19,
	    firstName: null,
	    lastName: null,
	    email: null,
	    matches: 3 },
	  { userId: 1,
	    loginServiceId: 17,
	    firstName: null,
	    lastName: null,
	    email: null,
	    matches: 1 } ]
*/
app.get('/getRankedUsers', (request, response) => {
	let msg = {}
	msg.action = 'Get Ranked Users';
	let userId = parseInt(request.query.userId);
	let isValid = true;

	if(analizer.userIdExists(userId)===false){
		isValid = false;
		msg.data = 'Invalid UserId';
	}

	if(isValid){
		msg.data = analizer.getRankedUsers(userId);
	}

	response.json(msg);
})


/*
    /getRankedUsersByBenefit?userId=0

    [ { userId: 2,
        loginServiceId: 19,
        firstName: 'Chore',
        lastName: null,
        email: null,
        myRating: null,
        myRatingCount: 0,
        benefit: 1200 },
      { userId: 3,
        loginServiceId: 20,
        firstName: 'Peyo',
        lastName: null,
        email: null,
        myRating: null,
        myRatingCount: 0,
        benefit: 800 },
      { userId: 1,
        loginServiceId: 18,
        firstName: 'Jimbo',
        lastName: null,
        email: null,
        myRating: null,
        myRatingCount: 0,
        benefit: 200 } ];

*/

app.get('/getRankedUsersByBenefit', (request, response) => {
    let msg = {}
    msg.action = 'Get Ranked Users by Benefit ';
    let userId = parseInt(request.query.userId);
    let isValid = true;

    if(analizer.userIdExists(userId)===false){
        isValid = false;
        msg.data = 'Invalid UserId';
    }

    if(isValid){
        msg.data = analizer.getRankedUsersByBenefit(userId);
    }

    response.json(msg);
})





/*
	/getUserMatchingVideoGames?userId=0

	[
		{ videoGameId: 0, title: 'Halo', image: 'halo.jpg' },
		{ videoGameId: 1, title: 'Call of Duty',image: 'call_of_duty.jpg' },
		{ videoGameId: 2, title: 'Gow', image: 'gow.jpg' } ]
*/
app.get('/getUserMatchingVideoGames', (request, response) => {
	let msg = {}
	msg.action = 'Get User Matching VideoGames';
	let userId = parseInt(request.query.userId);
	let isValid = true;

	if(analizer.userIdExists(userId)===false){
		isValid = false;
		msg.data = 'Invalid UserId';
	}

	if(isValid){
		msg.data = analizer.getUserMatchingVideoGames(userId);
	}

	response.json(msg);
})


/*
    Calculate all sell offers belonging to userId
    that matches with  offer from any other user
    returns array of objects containing properties
    of both matching users and info from the owner
    of the matching user

	/getVideoGameSellMatches?userId=0&videoGameId=0

	[ { myOfferId: 0,
	    myOfferPrice: 400,
	    myOfferType: 1,
	    matchingOfferId: 4,
	    matchingOfferPrice: 500,
	    matchingOfferType: 0,
	    matchingUserId: 1,
	    matchingUserFirstName: 'Jimbo',
	    matchingUserLastName: null,
	    matchingUserEmail: null },
	  { myOfferId: 0,
	    myOfferPrice: 400,
	    myOfferType: 1,
	    matchingOfferId: 5,
	    matchingOfferPrice: 800,
	    matchingOfferType: 0,
	    matchingUserId: 2,
	    matchingUserFirstName: 'Chore',
	    matchingUserLastName: null,
	    matchingUserEmail: null },
	  { myOfferId: 1,
	    myOfferPrice: 500,
	    myOfferType: 1,
	    matchingOfferId: 3,
	    matchingOfferPrice: 600,
	    matchingOfferType: 0,
	    matchingUserId: 1,
	    matchingUserFirstName: 'Jimbo',
	    matchingUserLastName: null,
	    matchingUserEmail: null } ]

*/
app.get('/getVideoGameSellMatches', (request, response) => {
	let msg = {}
	msg.action = 'Get VideoGame Sell Matches';
	let userId = parseInt(request.query.userId);
	let videoGameId = parseInt(request.query.videoGameId);
	let isValid = true;

	if(analizer.userIdExists(userId)===false){
		isValid = false;
		msg.data = 'Invalid UserId';
	}

	if(analizer.videoGameIdExists(videoGameId)===false){
		isValid = false;
		msg.data = 'Invalid VideoGameId';
	}

	if(isValid){
		msg.data = analizer.getVideoGameSellMatches(userId, videoGameId);
	}

	response.json(msg);
})


/*
	/getVideoGameBuyMatches?userId=1&videoGameId=0

	[ { myOfferId: 4,
	    myOfferPrice: 500,
	    myOfferType: 0,
	    matchingOfferId: 0,
	    matchingOfferPrice: 400,
	    matchingOfferType: 1,
	    matchingUserId: 0,
	    matchingUserFirstName: null,
	    matchingUserLastName: null,
	    matchingUserEmail: null },
	  { myOfferId: 3,
	    myOfferPrice: 600,
	    myOfferType: 0,
	    matchingOfferId: 1,
	    matchingOfferPrice: 500,
	    matchingOfferType: 1,
	    matchingUserId: 0,
	    matchingUserFirstName: null,
	    matchingUserLastName: null,
	    matchingUserEmail: null } ]
*/
app.get('/getVideoGameBuyMatches', (request, response) => {
	let msg = {}
	msg.action = 'Get User Buy Matches';
	let userId = parseInt(request.query.userId);
	let videoGameId = parseInt(request.query.videoGameId);
	let isValid = true;

	if(analizer.userIdExists(userId)===false){
		isValid = false;
		msg.data = 'Invalid UserId';
	}

	if(analizer.videoGameIdExists(videoGameId)===false){
		isValid = false;
		msg.data = 'Invalid VideoGameId';
	}

	if(isValid){
		msg.data = analizer.getVideoGameBuyMatches(userId, videoGameId);
	}

	response.json(msg);
})

/*[
     [ { userId: 0,
      firstName: 'Felipe',
      lastName: null,
      videoGameId: 0,
      title: 'Halo',
      image: 'halo.jpg',
      offerId: 1,
      price: 500,
      diff: 0 },
    { userId: 1,
      firstName: 'Jimbo',
      lastName: null,
      videoGameId: 1,
      title: 'Gow',
      image: 'gow.jpg',
      offerId: 3,
      price: 500,
      diff: 0 },
    { userId: 2,
      firstName: 'Chore',
      lastName: null,
      videoGameId: 2,
      title: 'Crash',
      image: 'crash.jpg',
      offerId: 5,
      price: 500,
      diff: 0 } ],

  [ { userId: 0,
      firstName: 'Felipe',
      lastName: null,
      videoGameId: 0,
      title: 'Halo',
      image: 'halo.jpg',
      offerId: 1,
      price: 500,
      diff: 0 },
    { userId: 1,
      firstName: 'Jimbo',
      lastName: null,
      videoGameId: 1,
      title: 'Gow',
      image: 'gow.jpg',
      offerId: 3,
      price: 500,
      diff: 0 },
    { userId: 2,
      firstName: 'Chore',
      lastName: null,
      videoGameId: 4,
      title: 'Dbz',
      image: 'dbz.jpg',
      offerId: 8,
      price: 500,
      diff: 0 } ],
  ]


*/

app.get('/getTriplets', (request, response) => {
    let msg = {}
    msg.action = 'Get Triplets'
    let userId = parseInt(request.query.userId);
    let isValid = true;
    if(analizer.userIdExists(userId)==false){
        isValid = false;
        msg.data = 'Invalid UserId'
    }

    if( isValid ){
        msg.data = analizer.getTriplets(userId);
    }

    response.json(msg);
})






/*
	/signin?loginServiceId=1234
*/
app.post('/signin', (request, response) => {
    let msg = {};
    msg.action = 'Sign in';
    let loginServiceId = request.query.loginServiceId

    if( analizer.loginServiceIdExists(loginServiceId)===false ){
      analizer.addUser(loginServiceId);
      msg.res = "New user registered Succesfully";
    }else{
      msg.res = "User already registered"
    }
    msg.data = analizer.getUserProperties( analizer.getUserIdFromLoginServiceId(loginServiceId) );
    response.json(msg);
})

/*
	/updateUserProperties?userId=0
*/
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


/*
	/addSellOffer?userId=0&videoGameId=0&price=500
*/
app.post('/addSellOffer', (request, response) => {
    let msg = {};
    msg.action = 'Add sell offer'
    let userId = parseInt(request.query.userId);
    let videoGameId = parseInt(request.query.videoGameId);
    let price = parseFloat(request.query.price).toFixed(2);
    price = parseFloat(price);

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

/*
	/addBuyOffer?userId=0&videoGameId=1&price=600
*/
app.post('/addBuyOffer', (request, response) => {
    let msg = {};
    msg.action = 'Add buy offer'
    let userId = parseInt(request.query.userId);
    let videoGameId = parseInt(request.query.videoGameId);
    let price = parseFloat(request.query.price).toFixed(2);
    price = parseFloat(price);

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

/*
	/deleteOffer?offerId=0
*/
app.post('/deleteOffer', (request, response) => {
    let msg = {};
    msg.action = 'Delete Offer';
    let offerId = parseInt(request.query.offerId);

    let isValid = true;


    if(analizer.offerIdExists(offerId)===false){
      isValid = false;
      msg.data = 'Invalid offerId'
    }

    if(isValid){
      analizer.deleteOffer(offerId);
      msg.data = "Offer Deleted"
    }

    response.json(msg);
})

/*
	/addRatingToUser?ratingUserId=1&ratedUserId=0&rating=4

*/
app.post('/addRatingToUser', (request,response) => {
	let msg = {};
	msg.action = 'Add Rating to User';
	let ratingUserId = parseInt(request.query.ratingUserId);
	let ratedUserId = parseInt(request.query.ratedUserId);
	let rating = parseInt(request.query.rating);

	let isValid = true;

	if(analizer.userIdExists(ratingUserId)===false
		|| analizer.userIdExists(ratedUserId)===false ){
		isValid = false;
		msg.data = "Invalid userIds";
	}

	if(isValid){
		analizer.addRatingToUser(ratingUserId, ratedUserId, rating);
	}

	response.json(msg);
})



// CHAT ENDPOINTS

/*
/getChatUsers?userId=0
{ action: 'Get chat users ',
  data:
   [ { userId: 1,
       loginServiceId: '17',
       firstName: null,
       lastName: null,
       email: null,
       myRating: null,
       myRatingCount: 0 } ] }
 */
app.get('/getChatUsers', (request, response) => {

    let msg = {};
    msg.action = 'Get chat users ';
    let userId = parseInt(request.query.userId);

    let isValid = true;
    if(analizer.userIdExists(userId)===false) {
        isValid = false;
        msg.data = 'Invalid userid'
    }

    if( isValid ){
        analizer.getChatUsers(userId).then( userProps => {
            msg.data = userProps;
            response.json(msg);
        })
    } else{
        response.json(msg);
    }
})


/*
    /getConversation?userId=0&mUserId=1

    { action: 'Get Conversation',
  data:
   [ { srcUserId: 0,
       destUserId: 1,
       dateMillis: 1541280501083,
       content: 'Bien y tu que tal James' },
     { srcUserId: 1,
       destUserId: 0,
       dateMillis: 1541280501081,
       content: 'Que onda como estas Felipe' },
     { srcUserId: 0,
       destUserId: 1,
       dateMillis: 1541280501079,
       content: 'Hola soy Felipe' } ] }
 */
app.get('/getConversation', (request, response) => {
    let msg = {};
    msg.action = 'Get Conversation';
    let userId = parseInt(request.query.userId);
    let mUserId = parseInt(request.query.mUserId);

    let isValid = true;
    if(analizer.userIdExists(userId)===false ||
            analizer.userIdExists(mUserId)===false ) {
        isValid = false;
        msg.data = 'Invalid userids'
    }

    if( isValid ){
        analizer.getConversation(userId,mUserId).then( messages => {
            msg.data = messages;
            response.json(msg);
        })
    } else {
        response.json(msg)
    }
})

/*
    /addMessage?rscUserId=0&destUserId=1
     body: {content:'Hola soy Felipe'}
 */
app.post('/addMessage', (request, response) => {
    let msg = {};
    msg.action = 'Add Message';
    let rscUserId = parseInt(request.query.rscUserId);
    let destUserId = parseInt(request.query.destUserId);
    let content = request.body.content;

    let isValid = true;
    if(analizer.userIdExists(rscUserId)===false ||
            analizer.userIdExists(destUserId)===false ) {
        isValid = false;
        msg.data = 'Invalid userids'
    }

    if( isValid ){
        analizer.addMessage(rscUserId, destUserId, content)
        msg.data = 'Message Added'
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
