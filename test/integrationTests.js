
const Analizer = require("../analizer/analizer").Analizer;
const request = require('request');


class IntegrationTests {

	testLoadCatalogueFromFolders(){
		
		let analizerResult = new Analizer();

		analizerResult.addVideoGame("animal crossing eds juego compra disponible","catalogue/3DS/animal_crossing_eds_juego_compra_disponible.png");
		analizerResult.addVideoGame("fifa soccer 2016 u.e ps3 -","catalogue/PS3/fifa_soccer_2016_u.e_ps3_-.png");
		analizerResult.addVideoGame("","catalogue/PS4/.png");
		analizerResult.addVideoGame("crash bandicoot n. sane trilogy","catalogue/SWITCH/crash_bandicoot_n._sane_trilogy.png");
		analizerResult.addVideoGame("angry birds trilogy -","catalogue/WiiU/angry_birds_trilogy_-.png");
		analizerResult.addVideoGame("far cry","catalogue/XBOX360/far_cry.png");
		analizerResult.addVideoGame("assassins creed odyssey gold edition","catalogue/XBOXONE/assassins_creed_odyssey_gold_edition.png");

		let correctAnswer = Array.from(analizerResult._catalogue._map.values()).sort(function(a, b){
			return a.getTitle() > b.getTitle();
		});

		let analizerTest = new Analizer();

		analizerTest.loadCatalogueFromFolders("./../analizer/catalogue/");

		setTimeout(
			function() {

				if(analizerResult.getCatalogueSize() !== analizerTest.getCatalogueSize()){
					console.log("testLoadCatalogue : Different sizes", false);
					return;
				}

				let testAnswer = Array.from(analizerTest._catalogue._map.values()).sort(function(a, b){
					return a.getTitle() > b.getTitle();
				});


				for(let i = 0; i < analizerResult.getCatalogueSize(); i++){
					let gameA = correctAnswer[i];
					let gameB = testAnswer[i];

					if(gameA._title !== gameB._title || gameA._image !== gameB._image){
						console.log("testLoadCatalogue : Different games", false);
						console.log(gameA,gameB);
						return;
					}
				}


				//console.log("testLoadCatalogue :", true);

			}, 1000);
	}

	

	
	testPOST(rsc, body){
		let options = {
			method : 'POST',
			url : 'http://localhost:8080' + rsc  ,
			form : body,
			headers: { 
				'User-Agent':'Mozilla/5.0',
				'authorization' : 'abcdef' }
		}

		request(options, (err, res, body) => {
			if( err ){
				throw err;
			} else{
				let json = JSON.parse(body);
				console.log(json);
			}
		});
	}


	testGET(rsc){
		let options = {
			method : 'GET',
			url : 'http://localhost:8080' + rsc  ,
			headers: { 
				'User-Agent':'Mozilla/5.0',
				'authorization' : 'abcdef' }
		}

		request(options, (err, res, body) => {
			if( err ){
				throw err;
			} else{
				let json = JSON.parse(body);
				console.log(json);
			}
		});
	}

	testLogin(){
		let src = '/signin?loginServiceId=16'
		let body = {  }
		this.testPOST(src, body);
	}

	testLogin2(){
		let src = '/signin?loginServiceId=17'
		let body = {  }
		this.testPOST(src, body);
	}

	testAddSellOffer(){
		let rsc = '/addSellOffer?userId=0&videoGameId=0&price=500'
		let body = {}
		this.testPOST(rsc, body);
	}	

	testAddSellOffer2(){
		let rsc = '/addSellOffer?userId=1&videoGameId=1&price=500'
		let body = {}
		this.testPOST(rsc, body);
	}

	testAddBuyOffer(){
		let rsc = '/addBuyOffer?userId=0&videoGameId=1&price=600'
		let body = {}
		this.testPOST(rsc, body);
	}

	testAddBuyOffer2(){
		let rsc = '/addBuyOffer?userId=1&videoGameId=0&price=600'
		let body = {}
		this.testPOST(rsc, body);
	}


	testUpdateUserProperties(){
		let rsc = '/updateUserProperties?userId=0'
		let body = {
			firstName:'Felipe',
			lastName:'Mendoza',
			email:'felipfmg17@gmail.com'
		}
		this.testPOST(rsc, body);
	}

	testUpdateUserProperties2(){
		let rsc = '/updateUserProperties?userId=1'
		let body = {
			firstName:'Jaime',
			lastName:'Daniel',
			email:'felipfmg17@gmail.com'
		}
		this.testPOST(rsc, body);
	}

	testDeleteOffer(){
		let rsc = '/deleteOffer?offerId=0'
		let body = {}
		this.testPOST(rsc, body);
	}

	testAddRatingToUser(){
		let rsc = '/addRatingToUser?ratingUserId=1&ratedUserId=0&rating=4'
		let body = {}
		this.testPOST(rsc, body);
	}


	testGetUserProperties(){
		this.testGET('/getUserProperties?userId=0');
	}

	testGetCatalogue(){
		this.testGET('/getCatalogue');
	}

	testGetUserSellList(){
		this.testGET('/getUserSellList?userId=0');
	}

	testGetUserBuyList(){
		this.testGET('/getUserBuyList?userId=0');
	}

	testGetVideoGameSellList(){
		this.testGET('/getVideoGameSellList?videoGameId=0');
	}

	testGetVideoGameBuyList(){
		this.testGET('/getVideoGameBuyList?videoGameId=1');
	}	

	testGetNotifications(){
		this.testGET('/getNotifications?userId=0');
	}

	testGetOffersProperties(){
		this.testGET('/getOffersProperties?userId=0');
	}

	testGetRankedUsers(){
		this.testGET('/getRankedUsers?userId=0');
	}

	testGetUserMatchingVideoGames(){
		this.testGET('/getUserMatchingVideoGames?userId=0')
	}

	testGetVideoGameSellMatches(){
		this.testGET('/getVideoGameSellMatches?userId=0&videoGameId=0');
	}

	testGetVideoGameBuyMatches(){
		this.testGET('/getVideoGameBuyMatches?userId=1&videoGameId=0');
	}

	testGetTriplets(){
		this.testGET('/getTriplets?userId=0')
	}


	testSaveAndLoadUsersFromBD(){
        let analizer = new Analizer();
        analizer.startPersistance();

        let analizer2 = new Analizer();
        analizer2.startPersistance();


        setTimeout( ()=>{
            let userId0 = analizer.addUser(16);
            let userId1 = analizer.addUser(17);
            let userId2 = analizer.addUser(18);
            analizer.updateUserProperties(userId0, {firstName:'Felipe',lastName:'Mendoza'})
            analizer.updateUserProperties(userId1, {firstName:'Jimbo',lastName:'Martinez'})
            analizer.stopPersistance();
		},3000)

        setTimeout( () => {
			analizer2._loadUsersFromDB();
		},5000)

		setTimeout( () => {
        	console.log(analizer2._getUsers() );
        	analizer2.stopPersistance();
		}, 7000 );

	}

	testSaveAndLoadCatalogueFromBD(){
	    let analizer = new Analizer();
	    analizer.startPersistance();

	    let analizer2 = new Analizer();
	    analizer2.startPersistance();

	    setTimeout( () => {
	    	analizer.addVideoGame('Halo','halo.png');
	    	analizer.addVideoGame('Gow','gow.png');
	    	analizer.stopPersistance();
		}, 3000 )

		setTimeout( () => {
			analizer2._loadVideoGamesFromDB();
		},5000)

		setTimeout( () => {
			console.log(analizer2.getCatalogue() );
			analizer2.stopPersistance();
		},7000)
	}

	testSaveAndLoadOffersFromBD(){
	    let analizer = new Analizer();
	    analizer.startPersistance();

	    let analizer2 = new Analizer();
	    analizer2.startPersistance();

	    setTimeout( () => {
	    	analizer.addVideoGame('Halo','halo.png');
	    	analizer.addVideoGame('Gow','gow.png');
	    	let userId0 = analizer.addUser(16);
            let userId1 = analizer.addUser(17);
            analizer.updateUserProperties(userId0, {firstName:'Felipe',lastName:'Mendoza'})
            analizer.updateUserProperties(userId1, {firstName:'Jimbo',lastName:'Martinez'})
            analizer.addBuyOffer(userId0,0,500);
            analizer.addSellOffer(userId1,1,700);
            analizer.stopPersistance();
		}, 3000 )

		setTimeout( () => {
			analizer2._loadUsersFromDB();
			analizer2._loadVideoGamesFromDB();
			analizer2._loadOffersFromDB();
		},5000)

		setTimeout( () => {
			console.log(analizer2.getOffersProperties() );
			analizer2.stopPersistance();
		},7000)
	}

	testMessagesSample(){
		let analizer = new Analizer();
	    analizer.startPersistance();

	    let analizer2 = new Analizer();
	    //analizer2.startPersistance();

		setTimeout( ()=>{
            let userId0 = analizer.addUser(16);
            let userId1 = analizer.addUser(17);
            let userId2 = analizer.addUser(18);
            let userId3 = analizer.addUser(19);
            analizer.updateUserProperties(userId0, {firstName:'Felipe',lastName:'Mendoza'})
            analizer.updateUserProperties(userId1, {firstName:'Jimbo',lastName:'Martinez'})
            analizer.updateUserProperties(userId2, {firstName:'Chore',lastName:'Vazquez'})
			analizer.addMessage(0,1,'Hola soy Felipe');
			analizer.addMessage(1,0,'Que onda soy Jimbo');
			analizer.addMessage(0,2,'Que pedo chore chore')
            analizer.addMessage(1,2,'ola k ace')

		},3000)

		setTimeout( () => {
			analizer.getChatUsers(0).then( userProps => { console.log('Props: ', userProps)} );
			analizer.getChatUsers(2).then( userProps => { console.log('Props: ', userProps)} );
			analizer.getConversation(0,1);
			analizer.getConversation(1,2);
			analizer.stopPersistance();
		},5000);

	}


	testMessages(){
		this.testPOST('/signin?loginServiceId=16', {});
        this.testPOST('/signin?loginServiceId=17', {});
        this.testPOST('/addMessage?rscUserId=0&destUserId=1', {content:'Hola soy Felipe'})
        this.testPOST('/addMessage?rscUserId=1&destUserId=0', {content:'Que onda como estas Felipe'})
        this.testPOST('/addMessage?rscUserId=0&destUserId=1', {content:'Bien y tu que tal James'})
		setTimeout( () =>{
			this.testGET('/getConversation?userId=0&mUserId=1');
			this.testGET('/getChatUsers?userId=0');
		},2000)
	}


    testRankings(){
        this.testPOST('/signin?loginServiceId=16', {});
        this.testPOST('/signin?loginServiceId=17', {});
        this.testPOST('/updateUserProperties?userId=0',{firstName:'Felipe',lastname:'Mendoza',email:'felip@gmail.com',country:'Mexico',city:'Guadalajara'});
        this.testPOST('/updateUserProperties?userId=1',{firstName:'Jaime',lastname:'Martinez',email:'jimbo@gmail.com',country:'USA',city:'Redwood city'});
        this.testPOST('/addRatingToUser?ratingUserId=0&ratedUserId=1&rating=4')
        setTimeout( () =>{
            this.testGET('/getUserProperties?userId=0');
            this.testGET('/getUserProperties?userId=1');
        },2000)
	}

	testFillUsers(){
		this.testPOST('/signin?loginServiceId=16', {});
        this.testPOST('/signin?loginServiceId=17', {});
        this.testPOST('/signin?loginServiceId=18', {});
        this.testPOST('/signin?loginServiceId=19', {});
        this.testPOST('/signin?loginServiceId=20', {});
        this.testPOST('/updateUserProperties?userId=0',{firstName:'Felipe',lastName:'Mendoza',email:'felip@gmail.com',country:'Mexico',city:'Guadalajara'});
        this.testPOST('/updateUserProperties?userId=1',{firstName:'Jaime',lastName:'Martinez',email:'jimbo@gmail.com',country:'USA',city:'Redwood city'});
        this.testPOST('/updateUserProperties?userId=2',{firstName:'Chore',lastName:'Vazquez',email:'vazquez@gmail.com',country:'Canada',city:'Quebec'});
        this.testPOST('/addRatingToUser?ratingUserId=0&ratedUserId=1&rating=4')
        this.testPOST('/addRatingToUser?ratingUserId=2&ratedUserId=1&rating=5')
        this.testPOST('/addRatingToUser?ratingUserId=1&ratedUserId=0&rating=1')


        setTimeout( () => {


		},1000);
	}

	testFillOffers(){
        this.testPOST('/addSellOffer?userId=0&videoGameId=0&price=500',{});
        this.testPOST('/addSellOffer?userId=0&videoGameId=1&price=700',{});
        this.testPOST('/addSellOffer?userId=0&videoGameId=2&price=300',{});
        this.testPOST('/addBuyOffer?userId=0&videoGameId=3&price=1000',{});
        this.testPOST('/addBuyOffer?userId=0&videoGameId=4&price=350',{});



        this.testPOST('/addSellOffer?userId=1&videoGameId=7&price=500',{});
        this.testPOST('/addSellOffer?userId=1&videoGameId=3&price=700',{});
        this.testPOST('/addSellOffer?userId=1&videoGameId=4&price=300',{});
        this.testPOST('/addBuyOffer?userId=1&videoGameId=0&price=1000',{});
        this.testPOST('/addBuyOffer?userId=1&videoGameId=2&price=350',{});

        this.testPOST('/addSellOffer?userId=2&videoGameId=5&price=500',{});
        this.testPOST('/addSellOffer?userId=2&videoGameId=6&price=700',{});
        this.testPOST('/addSellOffer?userId=2&videoGameId=2&price=300',{});
        this.testPOST('/addBuyOffer?userId=2&videoGameId=3&price=1000',{});
        this.testPOST('/addBuyOffer?userId=2&videoGameId=7&price=350',{});
    }


    testFillMessages(){
        this.testPOST('/addMessage?rscUserId=0&destUserId=1', {content:'Hola soy Felipe'})
        this.testPOST('/addMessage?rscUserId=1&destUserId=0', {content:'Que onda como estas Felipe'})
        this.testPOST('/addMessage?rscUserId=0&destUserId=1', {content:'Bien y tu que tal James'})
    }

	testGetAnalizerState(){
		this.testPOST();
	}

	testDemonstration1(){
        this.testPOST('/signin?loginServiceId=16', {});
        this.testPOST('/signin?loginServiceId=17', {});
        this.testPOST('/signin?loginServiceId=18', {});
        this.testPOST('/signin?loginServiceId=19', {});
        this.testPOST('/signin?loginServiceId=20', {});
        this.testPOST('/signin?loginServiceId=21', {});
        this.testPOST('/updateUserProperties?userId=0',{firstName:'Felipe',lastName:'Mendoza',email:'felip@gmail.com',country:'Mexico',city:'Guadalajara'});
        this.testPOST('/updateUserProperties?userId=1',{firstName:'Jaime',lastName:'Martinez',email:'jimbo@gmail.com',country:'USA',city:'Redwood city'});
        this.testPOST('/updateUserProperties?userId=2',{firstName:'Chore',lastName:'Vazquez',email:'vazquez@gmail.com',country:'Canada',city:'Quebec'});
        this.testPOST('/updateUserProperties?userId=3',{firstName:'Juanita',lastName:'Toledo',email:'juanita@gmail.com',country:'China',city:'Beijin'});
        this.testPOST('/updateUserProperties?userId=4',{firstName:'Norman',lastName:'Saucedo',email:'norman@gmail.com',country:'Mexico',city:'Monterrey'});
        this.testPOST('/updateUserProperties?userId=5',{firstName:'Nidia',lastName:'Cortez',email:'nidia@gmail.com',country:'Mexico',city:'CDMX'});

        setTimeout( ()=> {
            this.testPOST('/addSellOffer?userId=1&videoGameId=0&price=500',{});
            this.testPOST('/addBuyOffer?userId=1&videoGameId=1&price=600',{});

            this.testPOST('/addSellOffer?userId=2&videoGameId=0&price=700',{});
            this.testPOST('/addBuyOffer?userId=2&videoGameId=2&price=400',{});
        })

    }








	runAllTests(){
		console.log("IntegrationTest started ...");

		//this.testLoadCatalogueFromFolders();
		//this.testLogin();
		//this.testLogin2();
		//this.testUpdateUserProperties();
		//this.testUpdateUserProperties2();
		//this.testGetCatalogue();
		//this.testAddSellOffer();
		//this.testAddSellOffer2();
		//this.testDeleteOffer();
		//this.testAddBuyOffer();
		//this.testAddBuyOffer2();
		//this.testGetUserSellList();
		//this.testGetUserBuyList();
		//this.testGetVideoGameSellList();
		//this.testGetVideoGameBuyList();
		//this.testGetNotifications();
		//this.testGetOffersProperties();
		//this.testGetRankedUsers();
		//this.testAddRatingToUser();
		//this.testGetUserProperties();
		//this.testGetUserMatchingVideoGames();
		//this.testGetVideoGameSellMatches();
		//this.testGetVideoGameBuyMatches();
		//this.testGetTriplets();
        //this.testSaveAndLoadCatalogueFromBD();
		//this.testSaveAndLoadOffersFromBD();
		//this.testMessages();
		//this.testRankings();
		//this.testFill();
		//this.testMessages();

        // this.testFillOffers();
        //this.testFillUsers();
        this.testFillMessages();
        //this.testDemonstration1();

	}

}

exports.IntegrationTests = IntegrationTests;