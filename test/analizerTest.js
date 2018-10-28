

const Analizer = require("../analizer/analizer").Analizer;
const utils = require("../analizer/utils");

const compareSets = utils.compareSets;
const equalObjects = utils.equalObjects;
const equalArrays = utils.equalArrays;


class AnalizerTest {

	basicTest(){
	    var analizer = new Analizer();
	    analizer.addUser();
	    analizer.addVideoGame("God of War", "god_of_war.jpg");
	    analizer.addSellOffer(0,0,17);
	    analizer.addBuyOffer(0,0,18);
	}

	testAddUsers() {
	    var analizer = new Analizer();
	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();
	    var result = true;
	    if( analizer._users.size() != 5 ){
	        result = false;
	        console.log("size differ, original: ",5, " , found: ", analizer._users.size() );
	    }
	    if(result===false)
	    	console.log("testAddUsers: ",result);
	}

	testOfferAddedToUsersLists() {
	    var analizer = new Analizer();
	    
	    analizer.addVideoGame("God of War", "god_of_war.jpg");
        analizer.addVideoGame("Halo", "halo.jpg");
        analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
        analizer.addVideoGame("Crash Bandicoot", "crass_bandicoot.jpg");

	    analizer.addUser();
	    analizer.addBuyOffer(0,0,17);
	    analizer.addBuyOffer(0,1,18);
	    analizer.addBuyOffer(0,2,20);
	    analizer.addSellOffer(0,2,19);
	    analizer.addSellOffer(0,3,21);

	    var result = true;

	    if( analizer.getUser(0)._buyList.size !==3){
	        result = false;
	    }

	    if ( analizer.getUser(0)._sellList.size !==2 ){
	        result = false;
	    }

	    if(result===false)
	    	console.log("testOfferAddedToUsersLists: ",result);

	}

	testOfferAddedToBuyTrees () {
	    var analizer = new Analizer();
	    
	    analizer.addVideoGame("God of War", "god_of_war.jpg");
        analizer.addVideoGame("Halo", "halo.jpg");
        analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
        analizer.addVideoGame("Crash Bandicoot", "crass_bandicoot.jpg");

	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();

	    analizer.addBuyOffer(0,0,300);
	    analizer.addBuyOffer(1,0,700);
	    analizer.addBuyOffer(2,0,500);
	    analizer.addBuyOffer(3,0,700);

	    analizer.addBuyOffer(0,1,200);
	    analizer.addBuyOffer(1,1,100);
	    analizer.addBuyOffer(2,1,100);
	   
	    

	    var prices =[ [700,500,300], [200,100] ];
	    var sizes = [ [2,1,1], [1,2] ];

	    var result = true;

	    for(var i=0; i<analizer.getCatalogueSize(); i++ ){
	        var it = analizer.getVideoGame(i)._buyTree.iterator();
	        var node;
	        var mcount = 0;
	        while( (node=it.next()) !== null ){
	            if(node._price!=prices[i][mcount]){
	                result = false;
	                console.log("Prices differ, original:",prices[i][mcount],", found:",node._price);
	            }

	            if(node._offers.size !== sizes[i][mcount] ){
	                result = false;
	            }

	            mcount += 1;
	        }
	    }
	    if(result===false)
	    	console.log("testOfferAddedToBuyTrees : ", result);
	}

	testOfferAddedToSellTrees() {
	    var analizer = new Analizer();
	    
	    analizer.addVideoGame("God of War", "god_of_war.jpg");
        analizer.addVideoGame("Halo", "halo.jpg");
        analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
        analizer.addVideoGame("Crash Bandicoot", "crass_bandicoot.jpg");

	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();
	    analizer.addUser();

	    analizer.addSellOffer(0,0,300);
	    analizer.addSellOffer(1,0,700);
	    analizer.addSellOffer(2,0,500);
	    analizer.addSellOffer(3,0,700);

	    analizer.addSellOffer(0,1,200);
	    analizer.addSellOffer(1,1,100);
	    analizer.addSellOffer(2,1,100);

	    var prices =[ [300,500,700], [100,200] ];
	    var sizes = [ [1,1,2], [2,1] ];
	   

	    var result = true;

	    for(var i=0; i<analizer.getCatalogueSize(); i++ ){
	        var it = analizer.getVideoGame(i)._sellTree.iterator();
	        var node;
	        var mcount = 0;
	        while( (node=it.next()) !== null ){
	            if(node._price!=prices[i][mcount]){
	                result = false;
	                console.log("Prices differ, original:",prices[i][mcount],", found:",node._price);
	            }

	            if(node._offers.size !== sizes[i][mcount] ){
	                result = false;
	            }

	            mcount += 1;
	        }
	    }

	    if(result===false)
	    	console.log("testOfferAddedToSellTrees : ", result);
	}

	testGetUserSellList() {
		var analizer = new Analizer();
		analizer.addVideoGame("God of War", "god_of_war.jpg");
	    analizer.addVideoGame("Halo", "halo.jpg");
	    analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		
		analizer.addUser();

		analizer.addSellOffer(0,0,300);
		analizer.addSellOffer(0,1,500);
		analizer.addSellOffer(0,2,400);
		analizer.addSellOffer(0,2,800);
		analizer.deleteOffer(3);
		var userSellList = analizer.getUserSellList(0).sort( function(a,b){
			return a.offerId - b.offerId;
		});


		var originalUserSellList = [
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

		let properties = ['offerId','videoGameId','title','image','price'];
		var result = true;

		if( equalArrays(originalUserSellList,userSellList, properties)===false ){
			result = false;
			console.log("Sell List differ ");
			console.log("originalUserSellList : ", originalUserSellList);
			console.log("found: ",userSellList);
		}

		if(result===false)
			console.log("testGetUserSellList :",result);
	}


	testGetUserBuyList() {
		var analizer = new Analizer();
		analizer.addVideoGame("God of War", "god_of_war.jpg");
	    analizer.addVideoGame("Halo", "halo.jpg");
	    analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		
		analizer.addUser();

		analizer.addBuyOffer(0,0,300);
		analizer.addBuyOffer(0,1,500);
		analizer.addBuyOffer(0,2,400);
		analizer.addBuyOffer(0,2,700);
		analizer.deleteOffer(3);
		var userBuyList = analizer.getUserBuyList(0);
		userBuyList.sort( function(a,b){
			return a.offerId - b.offerId;
		});

		var originalUserBuyList = [
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

		var result = true;
		let properties = ['offerId','videoGameId','title','image','price'];
		if( equalArrays(originalUserBuyList,userBuyList, properties)===false  ){
			result = false;
			console.log("Buy List differ ");
			console.log("originalUserBuylList : ", originalUserBuyList);
			console.log("found: ",userBuyList);
		}

		if(result===false)
			console.log("testGetUserBuyList :",result);
	}


	testGetUserSellListWithDeletes() {
		var analizer = new Analizer();
		analizer.addVideoGame("God of War", "god_of_war.jpg");
	    analizer.addVideoGame("Halo", "halo.jpg");
	    analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		
		analizer.addUser();

		analizer.addSellOffer(0,0,300);
		analizer.addSellOffer(0,1,500);
		analizer.addSellOffer(0,2,400);
		analizer.deleteOffer(2);
		analizer.deleteOffer(1);
		analizer.addSellOffer(0,1,500);
		analizer.addSellOffer(0,2,400);
		var userSellList = analizer.getUserSellList(0);
		userSellList.sort( function(a,b){
			return a.offerId - b.offerId;
		});

		var originalUserSellList = [
			{
				offerId:0,
				title:"God of War",
				image:"god_of_war.jpg",
				price:300 },
			{
				offerId:3,
				title:"Halo",
				image:"halo.jpg",
				price:500 },
			{
				offerId:4,
				title:"Call of Duty",
				image:"call_of_duty.jpg",
				price:400 } 
		]

		var result = true;

		if( JSON.stringify(originalUserSellList) !== JSON.stringify(userSellList) ){
			result = false;
			console.log("Sell List differ ");
			console.log("originalUserSelllList : ", originalUserSellList);
			console.log("found: ",userSellList);
		}

		if(result===false)
			console.log("testGetUserSellListWithDeletes :",result);
	}

	testGetUserBuyListWithDeletes() {
		var analizer = new Analizer();
		analizer.addVideoGame("God of War", "god_of_war.jpg");
	    analizer.addVideoGame("Halo", "halo.jpg");
	    analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		
		analizer.addUser();

		analizer.addBuyOffer(0,0,300);
		analizer.addBuyOffer(0,1,500);
		analizer.addBuyOffer(0,2,400);
		analizer.deleteOffer(2);
		analizer.deleteOffer(1);
		analizer.addBuyOffer(0,1,500);
		analizer.addBuyOffer(0,2,400);
		var userBuyList = analizer.getUserBuyList(0);
		userBuyList.sort( function(a,b){
			return a.offerId - b.offerId;
		});

		var originalUserBuyList = [
			{
				offerId:0,
				title:"God of War",
				image:"god_of_war.jpg",
				price:300 },
			{
				offerId:3,
				title:"Halo",
				image:"halo.jpg",
				price:500 },
			{
				offerId:4,
				title:"Call of Duty",
				image:"call_of_duty.jpg",
				price:400 } 
		]

		var result = true;

		if( JSON.stringify(originalUserBuyList) !== JSON.stringify(userBuyList) ){
			result = false;
			console.log("Buy List differ ");
			console.log("originalUserBuylList : ", originalUserBuyList);
			console.log("found: ",userBuyList);
		}

		if(result===false)
			console.log("testGetUserBuyListWithDeletes :",result);
	}

	testGetCatalogue(){
		var analizer = new Analizer();
		analizer.addVideoGame("God of War", "god_of_war.jpg");
	    analizer.addVideoGame("Halo", "halo.jpg");
	    analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");

	    let originalCatalogue = [ 
	    	{ videoGameId:0, title: 'God of War', image: 'god_of_war.jpg' },
			{ videoGameId:1, title: 'Halo', image: 'halo.jpg' },
			{ videoGameId:2, title: 'Call of Duty', image: 'call_of_duty.jpg' } ];


	    let catalogue = analizer.getCatalogue();
	    let result = true;

	    if( JSON.stringify(originalCatalogue)!== JSON.stringify(catalogue) ){
	    	result = false;
	    	console.log("catalogue differs, ");
	    	console.log("original :",originalCatalogue);
	    	console.log("found :",catalogue);
	    }

	    if(result===false){
	    	console.log("testGetCatalogue :",result);
	    }
	}


	testEmptinessAtBeginning(){
		let analizer = new Analizer();
		let result = true;

		if( analizer.getUsersSize()!==0 ){
			result = false;
		}

		if (analizer.getCatalogueSize() !==0 ){
			result = false;
		}

		if(analizer.getOffersSize() !==0 ){
			result = false;
		}

		if( result===false ){
			console.log("testEmptinessAtBeginning: ",result);
		}
	}

	testGetUserProperties(){
		let analizer = new Analizer();
		let result = true;

		analizer.addUser(/*loginServiceId*/ 17);
		analizer.addUser(/*loginServiceId*/ 18);
		analizer.updateUserProperties(0, {
			firstName:'Felipe',
			lastName:'Mendoza',
			email:'felip@gmail.com'
		});



		let found = analizer.getUserProperties(0);

		let original = {
            userId:0,
            loginServiceId:17,
            myRating:null,
            myRatingCount:0,
            firstName:'Felipe',
			lastName:'Mendoza',
			email:'felip@gmail.com'
        }

        let prop =  ["userId","loginServiceId","firstName","lastName","email",'myRating','myRatingCount'];

		if( equalObjects(found,original,prop)===false ){
			result = false;
			console.log("userData differ ");
			console.log("original :", original);
			console.log("found : ", found);
		}

		if(result===false){
			console.log("testGetUserProperties(): ", result);
		}
	}



	testCreateVideoGameOffersList(){
		let analizer = new Analizer();
		analizer.addUser(666);
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addSellOffer(0,0,500);

		let prop = ["userId","loginServiceId","firstName","lastName","email","offerId","price"];

		let original = [{
			userId:0,
			loginServiceId:666,
			firstName:null,
			lastName:null,
			email:null,
			offerId:0,
			price:500
		} ];

		let offerList = analizer._createVideoGameOffersList([0]);

		let result = true;

		if( equalArrays(original,offerList, prop )===false ){
			result = false;
			console.log("Differ");
			console.log("original: ",original);
			console.log("found: ", offerList);
		}

		if(result===false){
			console.log("testCreateVideoGameOffersList: ",result);
		}
	}


	testGetVideoGameSellList(){
		let analizer = new Analizer();
		analizer.addUser(666);
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addSellOffer(0,0,500);

		let prop = ["userId","loginServiceId","firstName","lastName","email","offerId","price"];

		let original = [{
			userId:0,
			loginServiceId:666,
			firstName:null,
			lastName:null,
			email:null,
			offerId:0,
			price:500
		} ];

		let offerList = analizer.getVideoGameSellList(0);

		let result = true;

		if( equalArrays(original,offerList, prop )===false ){
			result = false;
			console.log("Differ");
			console.log("original: ",original);
			console.log("found: ", offerList);
		}

		if(result===false){
			console.log("testGetVideoGameSellList: ",result);
		}
	}

	testGetVideoGameBuyList(){
		let analizer = new Analizer();
		analizer.addUser(666);
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addBuyOffer(/*userId*/0,/*videoGameId*/0,/*price*/700);
		analizer.addBuyOffer(0,0,800);
		analizer.deleteOffer(/*offerId*/1);

		let prop = ["userId","loginServiceId","firstName","lastName","email","offerId","price"];

		let original = [{
			userId:0,
			loginServiceId:666,
			firstName:null,
			lastName:null,
			email:null,
			offerId:0,
			price:700
		} ];

		let offerList = analizer.getVideoGameBuyList(0);

		let result = true;

		if( equalArrays(original,offerList, prop )===false ){
			result = false;
			console.log("Differ");
			console.log("original: ",original);
			console.log("found: ", offerList);
		}

		if(result===false){
			console.log("testGetVideoGameBuyList: ",result);
		}
	}


	testNotifications(){
		let analizer = new Analizer();
		analizer.addUser(16);
		analizer.addUser(17);
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addBuyOffer(1,0,600);
		analizer.addBuyOffer(1,0,700);
		analizer.deleteOffer(3);

		let original = [ { userId: 1,
		    loginServiceId: 17,
		    firstName: null,
		    lastName: null,
		    email: null,
		    title: 'Halo',
		    offerId: 2,
		    image: 'halo.jpg',
		    price: 600,
		    type: 0 } ]

		let found = analizer.getNotifications(/*userId*/0);

		let prop = ['userId','loginServiceId','firstName','lastName','email','title','image','offerId','price','type'];
		let result = true;

		if( equalArrays(original,found, prop )===false ){
			result = false;
			console.log("Differ");
			console.log("original: ",original);
			console.log("found: ", found);
		}

		if(result===false){
			console.log("testNotifications: ",result);
		}


	}


	testGetOffersProperties(){
		let analizer = new Analizer();
		analizer.addUser(16);
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addBuyOffer(0,1,600);
		analizer.deleteOffer(/*offerId*/1);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/700);

		let found = analizer.getOffersProperties();
		let original = [ { offerId: 0,
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
        original = original.reverse();
		let prop = ['userId','loginServiceId','firstName','lastName','email',
					'videoGameId','title','image',
					'offerId','price','type'];
		let result = true;

		if( equalArrays(original,found, prop )===false ){
			result = false;
			console.log("Differ");
			console.log("original: ",original);
			console.log("found: ", found);
		}

		if(result===false){
			console.log("testGetOffersProperties: ",result);
		}
		
	}

	testGetRankedUsers(){
		let analizer = new Analizer();
		analizer.addUser(16);
		analizer.addUser(17);
		analizer.addUser(18);
		analizer.addUser(19);
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/400);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/600);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/1,/*price*/400);
		

		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/1,/*price*/600);
		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/1,/*price*/700);


		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/1,/*price*/700);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/0,/*price*/900);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/0,/*price*/800);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/0,/*price*/800);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/0,/*price*/800);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/0,/*price*/800);


		analizer.addBuyOffer(/*userId*/3,/*videoGameId*/1,/*price*/700);
		analizer.addBuyOffer(/*userId*/3,/*videoGameId*/1,/*price*/700);
		analizer.addBuyOffer(/*userId*/3,/*videoGameId*/0,/*price*/700);
		analizer.addBuyOffer(/*userId*/3,/*videoGameId*/0,/*price*/700);

		//console.log(analizer.getRankedUsers(0));
		//console.log(analizer.getRankedUsers(1));


		let original = [ { userId: 2,
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
					    matches: 1 } ];

		let found = analizer.getRankedUsers(0);

		let prop = ['userId','loginServiceId','firstName','lastName','email','matches'];
		let result = true;

		if( equalArrays(original,found, prop )===false ){
			result = false;
			console.log("Differ");
			console.log("original: ",original);
			console.log("found: ", found);
		}

		if(result===false){
			console.log("testGetRankedUsers: ",result);
		}
	}

	testRatings(){
		let analizer = new Analizer();

		let userId1 = analizer.addUser(/*loginServiceId*/ 17);
		let userId2 = analizer.addUser(/*loginServiceId*/ 18);
		let userId3 = analizer.addUser(/*loginServiceId*/ 19);
		let userId4 = analizer.addUser(/*loginServiceId*/ 20);
		analizer.updateUserProperties(0, {
			firstName:'Felipe',
			lastName:'Mendoza',
			email:'felip@gmail.com'
		});

		analizer.addRatingToUser(userId2,userId1,3);
		analizer.addRatingToUser(userId3,userId1,5);
		analizer.addRatingToUser(userId4,userId1,4);
		analizer.addRatingToUser(userId3,userId1,3);


		let result = true;


		let found = analizer.getUserProperties(0);

		let original = {
            userId:0,
            loginServiceId:17,
            myRating:'3.33',
            myRatingCount:3,
            firstName:'Felipe',
			lastName:'Mendoza',
			email:'felip@gmail.com'
        }

        let prop =  ["userId","loginServiceId","firstName","lastName","email",'myRating','myRatingCount'];

		if( equalObjects(found,original,prop)===false ){
			result = false;
			console.log("userData differ ");
			console.log("original :", original);
			console.log("found : ", found);
		}

		if(result===false){
			console.log("testRatings(): ", result);
		}
	}

	testGetUserMatchingVideoGames(){
		let analizer = new Analizer();

		let userId1 = analizer.addUser(/*loginServiceId*/ 17);
		let userId2 = analizer.addUser(/*loginServiceId*/ 18);
		let userId3 = analizer.addUser(/*loginServiceId*/ 19);
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		analizer.addVideoGame("Gow", "gow.jpg");

		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/400);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/1,/*price*/800);
		analizer.addBuyOffer(/*userId*/0,/*videoGameId*/2,/*price*/200);
		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/0,/*price*/500);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/1,/*price*/800);
		analizer.addSellOffer(/*userId*/2,/*videoGameId*/2,/*price*/150);

		let original = [ { videoGameId: 0, title: 'Halo', image: 'halo.jpg' },
		  { videoGameId: 1,
		    title: 'Call of Duty',
		    image: 'call_of_duty.jpg' },
		  { videoGameId: 2, title: 'Gow', image: 'gow.jpg' } ]

		let found = analizer.getUserMatchingVideoGames(userId1);

		let prop =  ['videoGameId','title','image'];
		let result = true;

		if( equalArrays(found,original,prop)===false ){
			result = false;
			console.log("userData differ ");
			console.log("original :", original);
			console.log("found : ", found);
		}

		if(result===false){
			console.log("testGetUserMatchingVideoGames(): ", result);
		}

	}

	testVideoGameSellMatches(){
		let analizer = new Analizer();

		let userId1 = analizer.addUser(/*loginServiceId*/ 17);
		let userId2 = analizer.addUser(/*loginServiceId*/ 18);
		let userId3 = analizer.addUser(/*loginServiceId*/ 19);
		analizer.updateUserProperties(userId2,{firstName:'Jimbo'});
		analizer.updateUserProperties(userId3,{firstName:'Chore'});
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		analizer.addVideoGame("Gow", "gow.jpg");

		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/400);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/1,/*price*/500);

		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/0,/*price*/600);
		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/0,/*price*/500);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/0,/*price*/800);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/1,/*price*/800);

		//analizer.addSellOffer(/*userId*/2,/*videoGameId*/2,/*price*/150);

		//console.log(analizer.getVideoGameSellMatches(/*userId*/0,/*videoGameId*/0));

		let original = [ { myOfferId: 0,
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
		let found = analizer.getVideoGameSellMatches(/*userId*/0,/*videoGameId*/0);
		let result = true;
		let prop = ['myOfferId',
				    'myOfferPrice',
				    'myOfferType',
				    'matchingOfferId',
				    'matchingOfferPrice',
				    'matchingOfferType',
				    'matchingUserId',
				    'matchingUserFirstName',
				    'matchingUserLastName',
				    'matchingUserEmail']
		if( equalArrays(found,original,prop)===false ){
			result = false;
			console.log("Differ ");
			console.log("original :", original);
			console.log("found : ", found);
		}

		if(result===false){
			console.log('testVideoGameSellMatches');
		}

	}

	testVideoGameBuyMatches(){
		let analizer = new Analizer();

		let userId1 = analizer.addUser(/*loginServiceId*/ 17);
		let userId2 = analizer.addUser(/*loginServiceId*/ 18);
		let userId3 = analizer.addUser(/*loginServiceId*/ 19);
		analizer.updateUserProperties(userId2,{firstName:'Jimbo'});
		analizer.updateUserProperties(userId3,{firstName:'Chore'});
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		analizer.addVideoGame("Gow", "gow.jpg");

		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/400);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/1,/*price*/500);

		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/0,/*price*/600);
		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/0,/*price*/500);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/0,/*price*/800);
		analizer.addBuyOffer(/*userId*/2,/*videoGameId*/1,/*price*/800);

		//analizer.addSellOffer(/*userId*/2,/*videoGameId*/2,/*price*/150);

		//console.log(analizer.getVideoGameSellMatches(/*userId*/0,/*videoGameId*/0));

		let original = [ { myOfferId: 4,
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
		let found = analizer.getVideoGameBuyMatches(/*userId*/1,/*videoGameId*/0);
		let result = true;
		let prop = ['myOfferId',
				    'myOfferPrice',
				    'myOfferType',
				    'matchingOfferId',
				    'matchingOfferPrice',
				    'matchingOfferType',
				    'matchingUserId',
				    'matchingUserFirstName',
				    'matchingUserLastName',
				    'matchingUserEmail']
		if( equalArrays(found,original,prop)===false ){
			result = false;
			console.log("Differ ");
			console.log("original :", original);
			console.log("found : ", found);
		}

		if(result===false){
			console.log('testVideoGameBuyMatches');
		}

	}


	testGetUserSellListWithMatching(){
		let analizer = new Analizer();

		let userId1 = analizer.addUser(/*loginServiceId*/ 17);
		let userId2 = analizer.addUser(/*loginServiceId*/ 18);
		let userId3 = analizer.addUser(/*loginServiceId*/ 19);
		analizer.updateUserProperties(userId2,{firstName:'Jimbo'});
		analizer.updateUserProperties(userId3,{firstName:'Chore'});
		analizer.addVideoGame('Halo','halo.jpg');
		analizer.addVideoGame("Call of Duty", "call_of_duty.jpg");
		analizer.addVideoGame("Gow", "gow.jpg");

		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/400);
		analizer.addSellOffer(/*userId*/0,/*videoGameId*/0,/*price*/500);
		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/0,/*price*/600);
		analizer.addBuyOffer(/*userId*/1,/*videoGameId*/0,/*price*/300);

		let original = [ { videoGameId: 0,
					    title: 'Halo',
					    image: 'halo.jpg',
					    offerId: 0,
					    price: 400,
					    type: 1,
					    matches: true },
					  { videoGameId: 0,
					    title: 'Halo',
					    image: 'halo.jpg',
					    offerId: 1,
					    price: 500,
					    type: 1,
					    matches: false } ]

        let found = analizer.getUserSellListWithMatching(1,0)

        let result = true;
        let prop = ['videoGameId','title','image','offerId','price','type','matches']

        if( equalArrays(found,original,prop)===false ){
			result = false;
			console.log("Differ ");
			console.log("original :", original);
			console.log("found : ", found);
		}

		if(result===false){
			console.log('testVideoGameBuyMatches');
		}
	}

	testCycles(){


		let analizer = new Analizer();

		let userId1 = analizer.addUser(/*loginServiceId*/ 17);
		let userId2 = analizer.addUser(/*loginServiceId*/ 18);
		let userId3 = analizer.addUser(/*loginServiceId*/ 19);
		let userId4 = analizer.addUser(/*loginServiceId*/ 20);

		analizer.updateUserProperties(userId1,{firstName:'Felipe'});
		analizer.updateUserProperties(userId2,{firstName:'Jimbo'});
		analizer.updateUserProperties(userId3,{firstName:'Chore'});
		analizer.updateUserProperties(userId4,{firstName:'Peyo'});
		analizer.addVideoGame('Halo','halo.jpg'); 		// 0
		analizer.addVideoGame("Gow", "gow.jpg");  		// 1
		analizer.addVideoGame("Crash", "crash.jpg");	// 2
		analizer.addVideoGame("Gears", "gears.jpg");	// 3
		analizer.addVideoGame("Dbz","dbz.jpg");			// 4
		analizer.addVideoGame("Fifa","fifa.jpg");		// 5
		analizer.addVideoGame("Mgs","mgs.jpg");			// 6


		analizer.addBuyOffer(userId1,/*videoGameId*/2,/*price*/500); 		// 0
		analizer.addSellOffer(userId1,/*videoGameId*/0,/*price*/500);		// 1

		analizer.addBuyOffer(userId2,/*videoGameId*/0,/*price*/600);		// 2
		analizer.addSellOffer(userId2,/*videoGameId*/1,/*price*/500);		// 3

		analizer.addBuyOffer(userId3,/*videoGameId*/1,/*price*/500);		// 4
		analizer.addSellOffer(userId3,/*videoGameId*/2,/*price*/500);		// 5

		analizer.addSellOffer(userId1,/*videoGameId*/3,/*price*/500);		// 6
		analizer.addBuyOffer(userId2,/*videoGameId*/3,/*price*/500);		// 7

		analizer.addSellOffer(userId3,/*videoGameId*/4,/*price*/500);		// 8
		analizer.addBuyOffer(userId1,/*videoGameId*/4,/*price*/500);		// 9

		analizer.addSellOffer(userId2,/*videoGameId*/5,/*price*/500);		// 10
		analizer.addBuyOffer(userId4,/*videoGameId*/5,/*price*/500);		// 11

		analizer.addSellOffer(userId4,/*videoGameId*/6,/*price*/500);		// 12
		analizer.addBuyOffer(userId1,/*videoGameId*/6,/*price*/500);		// 13

		analizer.addSellOffer(userId1,/*videoGameId*/3,/*price*/500);		// 14
		analizer.addBuyOffer(userId2,/*videoGameId*/3,/*price*/500);		// 15


		let original = [ [ [ 1, 2 ], [ 3, 4 ], [ 5, 0 ] ],
            [ [ 1, 2 ], [ 3, 4 ], [ 8, 9 ] ],
            [ [ 1, 2 ], [ 10, 11 ], [ 12, 13 ] ],
            [ [ 6, 7 ], [ 3, 4 ], [ 5, 0 ] ],
            [ [ 6, 7 ], [ 3, 4 ], [ 8, 9 ] ],
            [ [ 6, 7 ], [ 10, 11 ], [ 12, 13 ] ],
            [ [ 14, 15 ], [ 3, 4 ], [ 5, 0 ] ],
            [ [ 14, 15 ], [ 3, 4 ], [ 8, 9 ] ],
            [ [ 14, 15 ], [ 10, 11 ], [ 12, 13 ] ] ]

        let found = analizer._getCycles(userId1, 3);

		let result = true;

		original = JSON.stringify(original);
		found = JSON.stringify(found);


        if( original!==found){
            result = false;
            console.log("Differ ");
            console.log("original :", original);
            console.log("found : ", found);
        }

        if(result===false){
            console.log('testCycles');
        }
	}

	
	runAllTests() {
		console.log("AnalizerTest started ...");
	    this.testAddUsers();
	    this.testOfferAddedToUsersLists();
	    this.testOfferAddedToBuyTrees();
	    this.testOfferAddedToSellTrees();
	    this.testGetUserSellList();
	    this.testGetUserBuyList();
	    //this.testGetUserSellListWithDeletes();
	    //this.testGetUserBuyListWithDeletes();
	    this.testGetCatalogue();
	    this.testEmptinessAtBeginning();
	    this.testGetUserProperties();
	    this.testCreateVideoGameOffersList();
	    this.testGetVideoGameSellList();	
	    this.testGetVideoGameBuyList();	
	    this.testNotifications();
	    this.testGetOffersProperties();
	    //this.testGetBestUsers();
	    this.testGetRankedUsers();
	    this.testRatings();
	    this.testGetUserMatchingVideoGames();
	    this.testVideoGameSellMatches();
	    this.testVideoGameSellMatches();
	    this.testVideoGameBuyMatches();
	    this.testGetUserSellListWithMatching();
	    this.testCycles();
		console.log("AnalizerTest ended ...\n")
	}


}

exports.AnalizerTest = AnalizerTest
