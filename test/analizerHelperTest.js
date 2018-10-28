
const analizerHelper = require("../analizer/analizerHelper");
const User = analizerHelper.User;
const VideoGame = analizerHelper.VideoGame;
const Offer = analizerHelper.Offer;
const utils = require("../analizer/utils");
const compareSets = utils.compareSets;
const equalObjects = utils.equalObjects;
const equalArrays = utils.equalArrays;



class UserTest {

	testAddSellOffers(){
		var user = new User(/*userId*/0,/*firebaseId*/0);
		var offerIds = [5,2,7,5,9];
		for(var i=0;i<offerIds.length;i++){
			user.addSellOffer(offerIds[i]);
		}

		offerIds = new Set(offerIds);
		var sellList = new Set(user.getSellList() );

		var result = true;
		if(compareSets(offerIds,sellList)==false){
			result = false;
			console.log("Lists differ, original:",offerIds," , found:",sellList);
		}

		if(result===false)
			console.log("testAddSellOffers : ",result);
	}

	testAddBuyOffers(){
		var user = new User(/*userId*/0,/*loginServiceId*/0);
		var offerIds = [5,2,7,5,9];
		for(var i=0;i<offerIds.length;i++){
			user.addBuyOffer(offerIds[i]);
		}

		offerIds = new Set(offerIds);
		var buyList = new Set(user.getBuyList() );

		var result = true;
		if(compareSets(offerIds,buyList)==false){
			result = false;
			console.log("Lists differ, original:",offerIds," , found:",sellList);
		}

		if(result===false)
			console.log("testAddBuyOffers : ",result);
	}


	testUpdateProperties(){
		let user = new User(3,17);
		let properties = {
			firstName:'Felipe',
			lastName:'Mendoza',
			email: 'felipe@gmail.com'
		}
		user.updateProperties(properties);
		let newproperties = user.getProperties();
		properties.userId=3
		properties.loginServiceId = 17;

		let props = ["userId","loginServiceId","firstName","lastName","email"];

		let result = true;

		if( equalObjects(properties,newproperties,props)===false ){
			console.log("Properties Differ ");
			console.log("Original:",properties);
			console.log("Found:",newproperties);
			result = false;
		}

		if(result===false){
			console.log("testUpdatesProperties:",result);
		}
	}

	testGetProperties(){
		let user = new User(/*userId*/ 4, /*loginServiceId*/ 17);
		let userProperties = user.getProperties();
		let original = {
			userId:4,
			loginServiceId:17,
			firstName:null,
			lastName:null,
			email:null
		}
		let properties = ["userId","loginServiceId","firstName","lastName","email"]
		let result = true;

		if( equalObjects(original,userProperties, properties)===false ){
			console.log("Properties Differ ");
			console.log("Original:",original);
			console.log("Found:",userProperties);
			result = false;
		}


		if(result===false){
			console.log("testGetProperties:", result);
		}
	}

	testNotifications(){
		let user = new User(/*userId*/ 4, /*loginServiceId*/ 17);
		user.addNotification(2,3);
		user.addNotification(4,5);
		user.addNotification(6,7);
		user.deleteNotification(4,5);

		let original = [ { outOfferId: 2, inOfferId: 3 },
		{ outOfferId: 6, inOfferId: 7 } ]

		let found = user.getNotifications();

		if( equalArrays(original,found, ['outOfferId','inOfferId'])===false ){
			console.log("Differ");
			console.log("original: ", original);
			console.log("found: ", found);
			console.log("testNotifications: ",false);
		}

	}

	testMyRating(){
		let user = new User(/*userId*/ 4, /*loginServiceId*/ 17);
		user.updateMyRating(1);
		user.updateMyRating(2);
		user.updateMyRating(3);
		user.updateMyRating(4);
		user.updateMyRating(5);
		user.changeMyRating(/*OldRating*/5,/*NewRating*/10);
		user.updateMyRating(20);
		user.changeMyRating(5,1);

		let isValid = true;
		let found = user.getMyRating();
		let original = '6.00'
		if( found!==original ){
			isValid = false;
			console.log("Differ");
			console.log("original: ", original);
			console.log("found: ", found);
		}

		if( isValid===false ){
			console.log("testMyRating: ",false);
		}
	}

	testUserRatings(){
		let user = new User(/*userId*/ 4, /*loginServiceId*/ 17);
		user.updateUserRating(/*userId*/3,/*rating*/5);
		user.updateUserRating(/*userId*/2,/*rating*/4);
		let found = user.getUserRating(3);
		let original = 5;

		if( found!==original){
			console.log("Differ");
			console.log("original: ", original);
			console.log("found: ", found);
			console.log("testUserRatings: ",false);
		}
	}



	runAllTests(){
		console.log("UserTest started ...");
		this.testAddSellOffers();
		this.testAddBuyOffers();
		this.testGetProperties();
		this.testUpdateProperties();
		this.testNotifications();
		this.testMyRating();
		this.testUserRatings();
		console.log("UserTest ended ...\n")
	}
}






class VideoGameTest {
	testGetProperties() {
		let videoGame = new VideoGame(/*videoGameId*/5, /*title*/"Halo", /*image*/"halo.jpg");
		let videoGameProperties = videoGame.getProperties();
		let original = {
			videoGameId:5,
			title:"Halo",
			image:"halo.jpg"
		}

		let result = true;
		let properties = ["videoGameId","title","image"];

		if( equalObjects(original,videoGameProperties, properties)===false ){
			console.log("Properties Differ ");
			console.log("Original:",original);
			console.log("Found:",videoGameProperties);
		}


		if(result===false){
			console.log("testGetProperties:",result);
		}
	}

	testGetSellOfferIds(){
		let videoGame = new VideoGame(/*videoGameId*/5, /*title*/"Halo", /*image*/"halo.jpg");
		videoGame.addSellOffer(/*offerId*/9,/*price*/ 500.00);
		videoGame.addSellOffer(5, 600.00);
		videoGame.addSellOffer(4, 400.00);
		videoGame.addSellOffer(7, 550.00);
		videoGame.addSellOffer(1, 800.00);
		videoGame.addSellOffer(2, 200.00);
		videoGame.deleteOffer(/*offerId*/9,/*type*/1,/*price*/500);
		videoGame.deleteOffer(/*offerId*/1,/*type*/1,/*price*/800);

		let original = [2,4,7,5];
		let sellList = videoGame.getSellOfferIds();
		let result = true;

		if( equalArrays(original,sellList, [] )===false ){
			result = false
			console.log("Properties Differ");
			console.log("Original: ",original);
			console.log('Found: ',sellList);
		}

		if( result===false ){
			console.log("testGetSellList: ",result );
		}
	}

	testGetBuyOfferIds(){
		let videoGame = new VideoGame(/*videoGameId*/5, /*title*/"Halo", /*image*/"halo.jpg");
		videoGame.addBuyOffer(/*offerId*/9,/*price*/ 500.00);
		videoGame.addBuyOffer(5, 600.00);
		videoGame.addBuyOffer(4, 400.00);
		videoGame.addBuyOffer(7, 550.00);
		videoGame.deleteOffer(/*offerId*/9,/*type*/0,/*price*/500);

		let original = [5,7,4];
		let buyList = videoGame.getBuyOfferIds();
		let result = true;

		if( equalArrays(original,buyList, [] )===false ){
			result = false
			console.log("Properties Differ");
			console.log("Original: ",original);
			console.log('Found: ',buyList);
		}

		if( result===false ){
			console.log("testGetSellList: ",result );
		}
	}

	testGetSellOfferIdsLowerEqThan(){
		let videoGame = new VideoGame(/*videoGameId*/5, /*title*/"Halo", /*image*/"halo.jpg");
		videoGame.addSellOffer(/*offerId*/9,/*price*/ 500.00);
		videoGame.addSellOffer(5, 600.00);
		videoGame.addSellOffer(4, 400.00);
		videoGame.addSellOffer(7, 550.00);

		let original = [4,9];
		let found = videoGame.getSellOfferIdsLowerEqThan(510);
		let result = true;

		if( equalArrays(original,found, [] )===false ){
			result = false
			console.log("Properties Differ");
			console.log("Original: ",original);
			console.log('Found: ',found);
		}

		if( result===false ){
			console.log("testGetSellOfferIdsLowerEqThan: ",result );
		}
	}

	testGetBuyOfferIdsGreaterEqThan(){
		let videoGame = new VideoGame(/*videoGameId*/5, /*title*/"Halo", /*image*/"halo.jpg");
		videoGame.addBuyOffer(/*offerId*/9,/*price*/ 500.00);
		videoGame.addBuyOffer(5, 600.00);
		videoGame.addBuyOffer(4, 400.00);
		videoGame.addBuyOffer(7, 550.00);

		let original = [5,7];
		let found = videoGame.getBuyOfferIdsGreaterEqThan(525);
		let result = true;

		if( equalArrays(original,found, [] )===false ){
			result = false
			console.log("Properties Differ");
			console.log("Original: ",original);
			console.log('Found: ',found);
		}

		if( result===false ){
			console.log("testGetBuyOfferIdsGreaterEqThan: ",result );
		}
	}

	runAllTests(){
		console.log("VideoGameTest started ...");
		this.testGetProperties();
		this.testGetSellOfferIds();
		this.testGetBuyOfferIds();
		this.testGetSellOfferIdsLowerEqThan();
		this.testGetBuyOfferIdsGreaterEqThan();
		console.log("VideoGameTest ended ...\n");
	}
}

class OfferTest {
	testGetProperties(){
		let offer = new Offer(
			/*offerId*/ 74,
			/*userId*/ 43,
			/*videoGameId*/ 3,
			/*price*/4.58,
			/*type*/0 );
		let offerProperties = offer.getProperties();
		let original = {
			offerId:74,
			userId:43,
			videoGameId:3,
			price:4.58,
			type:0
		}

		let result = true;
		let properties = ["offerId","userId","videoGameId","price","type"];

		if( equalObjects(original, offerProperties, properties)===false ){
			console.log("Properties Differ ");
			console.log("Original:",original);
			console.log("Found:", offerProperties);
		}


		if(result===false){
			console.log("testGetProperties:",result);
		}

	}

	runAllTests(){
		console.log("OfferTest started ...");
		this.testGetProperties();
		console.log("OfferTest ended ...\n");
	}
}


exports.UserTest = UserTest;
exports.VideoGameTest = VideoGameTest;
exports.OfferTest = OfferTest;