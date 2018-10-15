
const analizerHelper = require("./analizerHelper");
const User = analizerHelper.User;
const VideoGame = analizerHelper.VideoGame;
const Offer = analizerHelper.Offer;
const utils = require("./utils");
const compareSets = utils.compareSets;
const equalObjects = utils.equalObjects;



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

	runAllTests(){
		console.log("UserTest started ...");
		this.testAddSellOffers();
		this.testAddBuyOffers();
		this.testGetProperties();
		this.testUpdateProperties();
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

	runAllTests(){
		console.log("VideoGameTest started ...");
		this.testGetProperties();
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