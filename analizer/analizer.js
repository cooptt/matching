

const analizerHelper = require("./analizerHelper");
const utils = require("./utils");
const User = analizerHelper.User;
const TreeNode = analizerHelper.TreeNode;
const VideoGame = analizerHelper.VideoGame;
const Offer = analizerHelper.Offer;
const IdMap = utils.IdMap;

class Analizer {

    constructor(){ 
        this._BUY = 0;
        this._SELL = 1;
        this._catalogue = new IdMap();
        this._users = new IdMap();
        this._offers = new IdMap();
        this._loginServiceMap = new Map();
    }

    // PUBLIC FUNCTIONS

    // Get data functions

    loginServiceIdExists(loginServiceId){
        return this._loginServiceMap.has(loginServiceId);
    }

    userIdExists(userId){
        return this._users.has(userId);
    }

    videoGameIdExists(videoGameId){
        return this._catalogue.has(videoGameId);
    }

    offerIdExists(offerId){
        return this._offers.has(offerId);
    }


    getUserIdFromLoginServiceId(loginServiceId){
        return this._loginServiceMap.get(loginServiceId);
    }

    getUsersSize(){
        return this._users.size();
    }

    getOffersSize(){
        return this._offers.size();
    }

    getCatalogueSize(){
        return this._catalogue.size();
    }

    getUserProperties(userId){
        let user = this.getUser(userId);
        return user.getProperties();
    }

    getCatalogue() {
        let catalogue = [];
        this._catalogue.getValues().forEach( videoGame => catalogue.push(videoGame.getProperties()) )
        return catalogue;
    }

    getUserSellList(userId){
        var user = this.getUser(userId);
        var sellList = user.getSellList(); // Array of offerIds
        return this._createUserOffersList(sellList);
    }

    getUserBuyList(userId){
        var user = this.getUser(userId);
        var buyList = user.getBuyList(); // Array of offerids
        return this._createUserOffersList(buyList);
    }


    getVideoGameSellList(videoGameId){
        let videoGame = this.getVideoGame(videoGameId);
        let sellOfferIds = videoGame.getSellOfferIds();
        return this._createVideoGameOffersList(sellOfferIds);
    }

    getVideoGameBuyList(videoGameId){
        let videoGame = this.getVideoGame(videoGameId);
        let buyOfferIds = videoGame.getBuyOfferIds();
        return this._createVideoGameOffersList(buyOfferIds);
    }






    // Add, Update, Delete functions

    addUser(loginServiceId) {
        this._loginServiceMap.set(loginServiceId, this._users.nextId() );
        this._users.insert( new User(this._users.nextId(), loginServiceId ) );
    }

    addSellOffer(userId, videoGameId, price) {
        let offer = new Offer(this._offers.nextId(), userId, videoGameId, price, this._SELL)
        let offerId = this._offers.insert(offer);
        this.getUser(userId).addSellOffer(offerId);
        this.getVideoGame(videoGameId).addSellOffer(offerId, price);
        let offerIds = this.getVideoGame(videoGameId).getBuyOfferIdsGreaterEqThan(price);
        this._addOffersConnections(offerId, offerIds);
    }

    addBuyOffer(userId, videoGameId, price) {
        let offer = new Offer(this._offers.nextId(), userId, videoGameId, price, this._BUY) ;
        var offerId = this._offers.insert(offer);
        this.getUser(userId).addBuyOffer(offerId);
        this.getVideoGame(videoGameId).addBuyOffer(offerId, price);
        let offerIds = this.getVideoGame(videoGameId).getSellOfferIdsLowerEqThan(price);
        this._addOffersConnections(offerId, offerIds);
    }

    updateUserProperties(userId, properties){
        this.getUser(userId).updateProperties(properties);
    }

    updateOfferProperties(offerId, properties){
        //this.getOffer(offerId).updateProperties(properties);
    }

    deleteUser() {

    }

    deleteOffer(offerId) {
        var offer = this.getOffer(offerId);
        this.getUser(offer.getUserId()).deleteOffer(offerId);
        this.getVideoGame(offer.getVideoGameId()).deleteOffer(offerId, offer.getType(), offer.getPrice());

    }

    

    




    // PRIVATE FUNCTIONS


    getOffer(offerId){
        return this._offers.get(offerId);
    }


    getUser(userId) {
        return this._users.get(userId);
    }
    
    getVideoGame(videoGameId) {
        return this._catalogue.get(videoGameId);
    }

    addVideoGame(title, image){
        this._catalogue.insert(new VideoGame(this._catalogue.nextId(), title, image) );
    }


    _createUserOffersList(offerIdList){
        var userOffersList = [];
        for(var i=0;i<offerIdList.length;i++){
            var offer = this.getOffer(offerIdList[i]);
            var videoGameProp = this.getVideoGame(offer.getVideoGameId()).getProperties();
            videoGameProp.offerId = offer.getOfferId();
            videoGameProp.price = offer.getPrice();
            userOffersList.push(videoGameProp);
        }
        return userOffersList;
    }

    _createVideoGameOffersList(offerIdList){
        let videoGameOffersList = [];
        for(let i=0;i<offerIdList.length;i++){
            let offer = this.getOffer(offerIdList[i]);
            let userProp = this.getUser(offer.getUserId()).getProperties();
            userProp.offerId = offer.getOfferId();
            userProp.price = offer.getPrice();
            videoGameOffersList.push(userProp);
        }
        return videoGameOffersList;
    }

    _addOffersConnections(newOfferId, offerIds){
        let newOffer = this.getOffer(newOfferId);
        offerIds.forEach( (offerId) => {
            newOffer.addConnection(offerId);
            this.getOffer(offerId).addConnection(newOfferId);
        });
    }

    _deleteOffersConnections(offerIdToDelete){
        let offerToDelete = this.getOffer(offerIdToDelete);
        let offerIds = offerToDelete.getConnections();
        offerIds.forEach( (offerId) => {
            this.getOffer(offerId).deleteConnection(offerIdToDelete);
            offerToDelete.deleteConnection(offerId);
        })
    }
    

    loadCatalogueFromFolders(cataloguePath) {
        const fs = require('fs');

        fs.readdir(cataloguePath, (err, consoleFolders) => {
            if(err){
                throw err;        
            }
            consoleFolders.forEach(consoleFolder => {


                let consolePath = cataloguePath + '/' + consoleFolder;

                fs.readdir(consolePath, (err, imagesNames) => {
                    imagesNames.forEach(imageName => {
                       

                        let videoGamePath = 'catalogue/' + consoleFolder + '/' + imageName;

                        let videoGameName = imageName.replace(/_/g, ' ').slice(0, imageName.length - 4);

                        this.addVideoGame(videoGameName, videoGamePath);
                    });
                })

            });
        });

        return;
    }

 
}



exports.Analizer = Analizer;
