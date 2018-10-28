
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








	runAllTests(){
		console.log("IntegrationTest started ...");
		this.testLoadCatalogueFromFolders();

		
		this.testLogin();
		this.testLogin2();
		//this.testUpdateUserProperties();
		//this.testUpdateUserProperties2();
		this.testGetCatalogue();
		this.testAddSellOffer();
		//this.testAddSellOffer2();
		//this.testDeleteOffer();
		//this.testAddBuyOffer();
		this.testAddBuyOffer2();
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
		this.testGetVideoGameSellMatches();
		this.testGetVideoGameBuyMatches();
		this.testGetTriplets();
	}


}

exports.IntegrationTests = IntegrationTests;