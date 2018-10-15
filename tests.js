
const integrationTests = require("./integrationTests");
const IntegrationTests = integrationTests.IntegrationTests;
const analizerHelperTest = require("./analizer/analizerHelperTest");
const analizerPersistanceTest = require('./analizer/analizerPersistanceTest');
const analizerTest = require('./analizer/analizerTest');
const AnalizerPersistanceTest = analizerPersistanceTest.AnalizerPersistanceTest;
const UserTest = analizerHelperTest.UserTest;
const VideoGameTest = analizerHelperTest.VideoGameTest;
const OfferTest = analizerHelperTest.OfferTest; 
const AnalizerTest = analizerTest.AnalizerTest;

let runUnitTests = function(){
	let userTest = new UserTest();
	let videoGameTest = new VideoGameTest();
	let offerTest = new OfferTest();
	let analizerPersistanceTest = new AnalizerPersistanceTest();
	let analizerTest = new AnalizerTest();


	userTest.runAllTests();
	videoGameTest.runAllTests();
	offerTest.runAllTests();
	analizerPersistanceTest.runAllTests();
	analizerTest.runAllTests();
}

let runIntegrationTests = function() {
	let integrationTests = new IntegrationTests();

	integrationTests.runAllTests();
}



runUnitTests();
runIntegrationTests();