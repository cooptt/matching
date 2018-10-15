
const mysql = require('mysql');


class AnalizerPersistance {
    
    connect(host,user,password,database){
    	this._db = mysql.createConnection({
    		host:host,
    		user:user,
    		password:password,
    		database:database
    	});

    	this._db.connect( function(err) {
    		if (err){
    			console.log("error with db");
    		}
    	});
    }

    end(){
        this._db.end();
    }

    /*
        properties = {
            userId:4,
            loginServiceId:17,
            firstName:null,
            lastName:null,
            email:null
        }
    */
    addUser(properties){

    }

    /*
        properties = {
            videoGameId:5,
            title:"Halo",
            image:"halo.jpg"
        }
    */
    addVideoGame(properties){

    }


    /*
        properties = {
            offerId:74,
            userId:43,
            videoGameId:3,
            price:4.58,
            type:0
        }
    */
    addOffer(properties){

    }

    updateUser(properties){

    }

    updateOffer(properties){

    }

    deleteUser(userId){

    }

    deleteVideoGame(videoGameId){

    }

    deleteOffer(offerId){

    }


    // Returns All rows of User's table
    loadUsers(){

    }

    // Returns all rows of VideoGames's table
    loadCatalogue(){

    }

    // Returns all rows of Offers' table
    loadOffers(){

    }


}



exports.AnalizerPersistance = AnalizerPersistance;