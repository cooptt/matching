

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

    
    getNotifications(userId){
        let offerIdPairs = this.getUser(userId).getNotifications();
        let notifications = [];
        offerIdPairs.forEach( (offerIdPair) => {
            let offer = this.getOffer(offerIdPair.outOfferId);
            let user = this.getUser(offer.getUserId());
            let videoGame = this.getVideoGame(offer.getVideoGameId());
            let notificationProps = user.getProperties();
            notificationProps.title = videoGame.getTitle();
            notificationProps.image = videoGame.getImage();
            notificationProps.price = offer.getPrice();
            notificationProps.type = offer.getType();
            notifications.push(notificationProps);
        });
        return notifications;
    }

    getOffersProperties(){
        let offersPropertiesList = [] 
        this._offers.getValues().forEach( offer => {
            let user = this.getUser(offer.getUserId());
            let videoGame = this.getVideoGame(offer.getVideoGameId());
            let prop = Object.assign(offer.getProperties(),
                                    videoGame.getProperties(),
                                    user.getProperties() );
            offersPropertiesList.push(prop);
        } );
        return offersPropertiesList;
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
        //let offerIds = this.getVideoGame(videoGameId).getBuyOfferIdsGreaterEqThan(price);
        //this._addOffersConnections(offerId, offerIds);
        let offerIds = this._getMatchingOfferIds(offerId);
        this._createNotifications(offerId, offerIds);
    }

    addBuyOffer(userId, videoGameId, price) {
        let offer = new Offer(this._offers.nextId(), userId, videoGameId, price, this._BUY) ;
        var offerId = this._offers.insert(offer);
        this.getUser(userId).addBuyOffer(offerId);
        this.getVideoGame(videoGameId).addBuyOffer(offerId, price);
        //let offerIds = this.getVideoGame(videoGameId).getSellOfferIdsLowerEqThan(price);
        //this._addOffersConnections(offerId, offerIds);
        let offerIds = this._getMatchingOfferIds(offerId);
        this._createNotifications(offerId, offerIds);
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
        //this._deleteOffersConnections(offerId);
        let offerIds = this._getMatchingOfferIds(offerId);
        this._removeNotifications(offerId, offerIds);
        this._offers.remove(offerId);
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

    _getMatchingOfferIds(offerId){
        let offer = this.getOffer(offerId);
        let offerIds = []
        if(offer.getType()===this._SELL){
            offerIds = this.getVideoGame(offer.getVideoGameId()).getBuyOfferIdsGreaterEqThan(offer.getPrice());
        } else if( offer.getType()===this._BUY ){
            offerIds = this.getVideoGame(offer.getVideoGameId()).getSellOfferIdsLowerEqThan(offer.getPrice());
        }
        return offerIds;
    }

    _createNotifications(originOfferId, offerIds){
        offerIds.forEach( offerId => {
            let offer = this.getOffer(offerId);
            this.getUser(offer.getUserId()).addNotification(originOfferId, offerId);
        })
    }

    _removeNotifications(originOfferId, offerIds){
        let originOffer = this.getOffer(originOfferId);
        let originUser = this.getUser(originOffer.getUserId());
        offerIds.forEach( offerId => {
            originUser.deleteNotification(offerId, originOfferId);
            let offer = this.getOffer(offerId);
            this.getUser(offer.getUserId()).deleteNotification(originOfferId, offerId);
        })
    }

    /*
    _addOffersConnections(newOfferId, offerIds){
        let newOffer = this.getOffer(newOfferId);
        offerIds.forEach( (offerId) => {
            newOffer.addConnection(offerId);
            let offer = this.getOffer(offerId);
            offer.addConnection(newOfferId);
            let user = this.getUser(offer.getUserId());
            user.addNotification(newOfferId, offerId);
        });
    }
    */

    /*
    _deleteOffersConnections(offerIdToDelete){
        let offerToDelete = this.getOffer(offerIdToDelete);
        let offerIds = offerToDelete.getConnections();
        let user = this.getUser(offerToDelete.getUserId());
        offerIds.forEach( (offerId) => {
            let offer = this.getOffer(offerId);
            offer.deleteConnection(offerIdToDelete);
            offerToDelete.deleteConnection(offerId);
            this.getUser(offer.getUserId()).deleteNotification(offerIdToDelete, offerId);
            user.deleteNotification(offerId, offerIdToDelete);
        })
    }
    */


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
