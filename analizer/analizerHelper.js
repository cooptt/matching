const RBTree = require('bintrees').RBTree;
const utils = require('./utils');
const IdMap = utils.IdMap;
const CircularQueue = utils.CircularQueue;




class User {
    constructor(userId, loginServiceId) {
        this._userId = userId;
        this._loginServiceId = loginServiceId;
        this._firstName = null;
        this._lastName = null;
        this._email = null;
        this._sellList = new Set(); // OfferIds
        this._buyList = new Set();  // OfferIds
        this._notifications = new CircularQueue(10, (offerIdPairA, offerIdPairB) => {
            return offerIdPairA.outOfferId===offerIdPairB.outOfferId && offerIdPairA.inOfferId===offerIdPairB.inOfferId;
        });
        this._myRating = null;
        this._myRatingSum = 0;
        this._myRatingCount = 0;
        this._usersRatings = new Map() // key: userIds, value: rating
    }

    getUserId(){
        return this._userId;
    }

    getLoginServiceId(){
        return this._loginServiceId;
    }

    getFirstName(){
        return this._firstName;
    }

    getLastName(){
        return this._lastName;
    }

    getEmail(){
        return this._email;
    }

    getMyRating(){
        return this._myRating;
    }

    getMyRatingCount() {
        return this._myRatingCount
    }



    /*
        {
            userId:4,
            loginServiceId:17,
            firstName:null,
            lastName:null,
            email:null
        }
    */
    getProperties(){
        return {
            userId:this._userId,
            loginServiceId:this._loginServiceId,
            firstName:this._firstName,
            lastName:this._lastName,
            email:this._email,
            myRating:this._myRating,
            myRatingCount:this._myRatingCount
        }
    }

    // OfferIds
    getSellList(){
        return Array.from(this._sellList);
    }

    // OfferIds
    getBuyList(){
        return Array.from(this._buyList);
    }

    getSellAndBuyList(){
        return this.getSellList().concat(this.getBuyList());
    }

    getNotifications(){
        return this._notifications.getValues();
    }

    getUserRating(userId){
        return this._usersRatings.get(userId);
    }

    hasUserRating(userId){
        //console.log('hasrating: ', userId, this._usersRatings.has(userId))
        return this._usersRatings.has(userId);
    }



    addSellOffer(offerId){
        this._sellList.add(offerId);
    }

    addBuyOffer(offerId){
        this._buyList.add(offerId);
    }

    addNotification(outOfferId, inOfferId){
        this._notifications.add( this._createOfferIdPair(outOfferId,inOfferId) );
    }

    addUserRating(userId, rating){
        //console.log( 'adduserRating ', userId);
        this._usersRatings.set(userId, rating);
    }


    updateMyRating(rating){
        this._myRatingSum += rating;
        this._myRatingCount++;
        this._myRating = (this._myRatingSum/this._myRatingCount).toFixed(2);;
    }

    changeMyRating(oldRating, newRating){
        this._myRatingSum += newRating - oldRating;
        this._myRating = (this._myRatingSum/this._myRatingCount).toFixed(2);;
    }

    updateUserRating(userId, rating){
        this._usersRatings.set(userId,rating);
    }


    updateProperties(properties){
        ['firstName','lastName','email'].forEach( (prop) =>{
            if( prop in properties ){
                this['_'+prop] = properties[prop];
            }
        })
    }

    deleteOffer(offerId){
        this._sellList.delete(offerId);
        this._buyList.delete(offerId);
    }

    deleteNotification(outOfferId, inOfferId){
        this._notifications.delete( this._createOfferIdPair(outOfferId,inOfferId));
    }

    _createOfferIdPair(outOfferId, inOfferId){
        return {
            outOfferId:outOfferId,
            inOfferId:inOfferId
        };
    }


}

class TreeNode{
    constructor(price){
        this._price = price;      // investigate function
        this._offers = new Set(); // OfferIds
    }

    addOffer(offerId) {
        this._offers.add(offerId); 
    }

    deleteOffer(offerId){
        this._offers.delete(offerId);
    }

    getOfferIds(){
        return Array.from(this._offers);
    }

    getPrice(){
        return this._price;
    }

    cmp(x) {
        return this._price - x._price;
    }
}


var printBST = function(tree){
    var it = tree.iterator();
    var item;
    while( (item=it.next()) !== null) {
        console.log(item);
    }
    console.log("\n");
}


var lowerTreeNode = function(a,b) {
    return a.cmp(b);
}

var greaterTreeNode = function(a,b) {
    return b.cmp(a);
}

class VideoGame {
    constructor(videoGameId, title, image){
        this.BUY = 0;
        this.SELL = 1;
        this._videoGameId = videoGameId;
        this._title = title;
        this._image = image;
        this._sellTree = new RBTree( lowerTreeNode );     // Tree of TreeNode
        this._buyTree = new RBTree( greaterTreeNode );        // Tree of TreeNode
    }


    getVideoGameId(){
        return this._videoGameId;
    }

    getTitle(){
        return this._title;
    }

    getImage(){
        return this._image;
    }

    getBuyTree(){
        return this._buyTree;
    }

    getSellTree(){
        return this._sellTree;
    }

    getProperties(){
        return {
            videoGameId:this._videoGameId,
            title:this._title,
            image:this._image
        }
    }

    // Return Offer Ids
    getSellOfferIds(){
        let offerIds = []
        let it = this.getSellTree().iterator(), item;
        
        while((item = it.next()) !== null) {
            let tmpOfferIds = item.getOfferIds();
            for(let i=0;i<tmpOfferIds.length; i++){
                offerIds.push(tmpOfferIds[i]);
            }
        }

        return offerIds;
    }

    getBuyOfferIds(){
        let offerIds = []
        let it = this.getBuyTree().iterator(), item;
        
        while((item = it.next()) !== null) {
            let tmpOfferIds = item.getOfferIds();
            for(let i=0;i<tmpOfferIds.length; i++){
                offerIds.push(tmpOfferIds[i]);
            }
        }

        return offerIds;
    }


    getSellOfferIdsLowerEqThan(price){
        let offerIds = []
        let it = this.getSellTree().iterator(), item;
        
        while((item = it.next()) !== null) {
            if(item.getPrice()>price){
                break;
            }

            let tmpOfferIds = item.getOfferIds();
            for(let i=0;i<tmpOfferIds.length; i++){
                offerIds.push(tmpOfferIds[i]);
            }
        }

        return offerIds;
    }

    getBuyOfferIdsGreaterEqThan(price){
        let offerIds = []
        let it = this.getBuyTree().iterator(), item;
        
        while((item = it.next()) !== null) {
            if(item.getPrice()<price){
                break;
            }

            let tmpOfferIds = item.getOfferIds();
            for(let i=0;i<tmpOfferIds.length; i++){
                offerIds.push(tmpOfferIds[i]);
            }
        }

        return offerIds;
    }

    addSellOffer(offerId, price){
        var node = new TreeNode(price);
        var res = this._sellTree.find(node);
        if( res===null){
            this._sellTree.insert(node);
        }
        var ans = this._sellTree.find(node);
        this._sellTree.find(node).addOffer(offerId);
    }

    addBuyOffer(offerId, price){
        var node = new TreeNode(price);
        var res = this._buyTree.find(node);
        if( res===null){
            this._buyTree.insert(node);
        }
        this._buyTree.find(node).addOffer(offerId);
    }

    /*
        {
            videoGameId:5,
            title:"Halo",
            image:"halo.jpg"
        }
    */
    updateProperties(properties){
        ['videoGameId','title','image'].forEach( (prop) =>{
            if( prop in properties ){
                this['_'+prop] = properties[prop];
            }
        })
    }

    deleteOffer(offerId, type, price){
        var node = new TreeNode(price);
        var res = null;
        if(type===this.BUY){ //Buy
            res = this._buyTree.find(node);
        }else if (type===this.SELL){
            res = this._sellTree.find(node);
        }
        if( res!==null ){
            res.deleteOffer(offerId);
        } 
    }

}



class Offer {
    constructor(offerId, userId, videoGameId, price, type) {
        this._offerId = offerId;
        this._userId = userId;
        this._videoGameId = videoGameId;
        this._price = price  // float
        this._type = type;  // 0: buy,  1: sell
        this._connections = new Set();
    }

    getOfferId(){
        return this._offerId;
    }

    getUserId(){
        return this._userId;
    }

    getVideoGameId(){
        return this._videoGameId;
    }

    getPrice(){
        return this._price;
    }

    getType(){
        return this._type;
    }

    /*
    {
        offerId:74,
        userId:43,
        videoGameId:3,
        price:4.58,
        type:0
    }
    */
    getProperties(){
        return  {
            offerId:this._offerId,
            userId:this._userId,
            videoGameId:this._videoGameId,
            price:this._price,
            type:this._type
        }
    }

    updateProperties(properties){
        ['price'].forEach( (prop) =>{
            if( prop in properties ){
                this['_'+prop] = properties[prop];
            }
        })
    }

    addConnection(offerId){
        this._connections.add(offerId);
    }

    getConnections(){
        return Array.from(this._connections);
    }

    deleteConnection(offerId){
        this._connections.delete(offerId);
    }
}


exports.User = User;
exports.TreeNode = TreeNode;
exports.VideoGame = VideoGame;
exports.Offer = Offer;
exports.IdMap = IdMap;