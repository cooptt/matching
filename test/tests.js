
const integrationTests = require("./integrationTests");
const IntegrationTests = integrationTests.IntegrationTests;
const analizerHelperTest = require("./analizerHelperTest");
const analizerPersistanceTest = require('./analizerPersistanceTest');
const analizerTest = require('./analizerTest');
const AnalizerPersistanceTest = analizerPersistanceTest.AnalizerPersistanceTest;
const UserTest = analizerHelperTest.UserTest;
const VideoGameTest = analizerHelperTest.VideoGameTest;
const OfferTest = analizerHelperTest.OfferTest; 
const AnalizerTest = analizerTest.AnalizerTest;

let runUnitTests = function(){
	let userTest = new UserTest();
	let videoGameTest = new VideoGameTest();
	let offerTest = new OfferTest();
	let analizerTest = new AnalizerTest();


	userTest.runAllTests();
	videoGameTest.runAllTests();
	offerTest.runAllTests();
	analizerTest.runAllTests();
}

let runIntegrationTests = function() {
	let integrationTests = new IntegrationTests();
	let analizerPersistanceTest = new AnalizerPersistanceTest();

	integrationTests.runAllTests();
	//analizerPersistanceTest.runAllTests();
}



runUnitTests();
runIntegrationTests();