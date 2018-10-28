
const analizerPersistance = require('../analizer/analizerPersistance')
const AnalizerPersistance = analizerPersistance.AnalizerPersistance;

class AnalizerPersistanceTest{


	testMySQLConnection(){
		this.persistance = new AnalizerPersistance();
		this.persistance.connect('localhost','root','root','analizer');
	}

	testCloseConnection(){
		this.persistance.end();
	}

	testAddUser(properties){
		  this.persistance.addUser(properties)
		  .then((result)=>{
		      console.log(result);
		  })
		  .catch( (error)=>{
		      console.log(error);
		  })
	}



	testUpdateUser(properties){
	  this.persistance.updateUser(properties)
	  .then((result)=>{
	      console.log(result);
	  })
	  .catch( (error)=>{
	      console.log(error);
	  })
	}




	testDeleteUser(userId){
	    this.persistance.deleteUser(userId)
	    .then((result)=>{
	        console.log(result);
	    })
	    .catch(error=>{
	        console.log(error);
	    })
	}


	testLoadUsers(){
	    this.persistance.loadUsers()
	    .then((result)=>{
	      // here works with the query result
	        console.log(result);
	    })
	    .catch(error=>{
	        console.log(error);
	    })
	}



	testAddOffer(properties){
		  this.persistance.addOffer(properties)
		  .then((result)=>{
		      console.log(result);
		  })
		  .catch( (error)=>{
		      console.log(error);
		  })
	}

	testAddVideoGame(properties){
		  this.persistance.addVideoGame(properties)
		  .then((result)=>{
		      console.log(result);
		  })
		  .catch( (error)=>{
		      console.log(error);
		  })
	}



	testSQLFunctions(){
		let properties = {
		    userId : "33",
		    loginServiceId : "17",
		    firstName: "Felpo",
		    lastName: "Mendz",
		    email: "felpo@gmail.com"
		}
		this.testAddUser(properties)


		properties = {
		    userId : "12",
		    loginServiceId : "313",
		    firstName: "James",
		    lastName: "Martz",
		    email: "james@gmail.com"
		}
		this.testAddUser(properties)


		properties = {
		    userId : "33",
		    firstName: "Felipe",
		    lastName: "Galves",
		    punctuation: "10"
		}


		this.testUpdateUser(properties)
		this.testLoadUsers()
		this.testDeleteUser('12')
		this.testLoadUsers()



		properties = {
		    videoGameId : "3",
		    title : "Halo",
		    image : "Halo.jpg"
		}

		this.testAddVideoGame(properties)

		properties = {
		    offerId:"74",
		    userId:"33",
		    videoGameId:"3",
		    price:"4.58",
		    type:"0"
		}

		this.testAddOffer(properties);

	}

	runAllTests(){
		console.log("AnalizerPersistanceTest started ...");
		this.testMySQLConnection();
		this.testSQLFunctions();
		this.testCloseConnection();
		console.log("AnalizerPersistanceTest ended ...\n");
	}

}




exports.AnalizerPersistanceTest = AnalizerPersistanceTest;
