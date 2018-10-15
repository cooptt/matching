
const analizerPersistance = require('./analizerPersistance')
const AnalizerPersistance = analizerPersistance.AnalizerPersistance;

class AnalizerPersistanceTest{
	
	testMySqlConnection(){
		
		let persistance = new AnalizerPersistance();
		persistance.connect('localhost','root','root','analizer');
		persistance.end();
	}

	runAllTests(){
		console.log("AnalizerPersistanceTest started ...");
		this.testMySqlConnection();
		console.log("AnalizerPersistanceTest ended ...\n");
	}

}

exports.AnalizerPersistanceTest = AnalizerPersistanceTest;