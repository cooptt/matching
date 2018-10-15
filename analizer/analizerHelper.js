const RBTree = require('bintrees').RBTree;
const utils = require('./utils');
const IdMap = utils.IdMap;




class User {
    constructor(userId, loginServiceId) {
        this._userId = userId;
        this._loginServiceId = loginServiceId;
        this._firstName = null;
        this._lastName = null;
        this._email = null;
        this._sellList = new Set(); // OfferIds
        this._buyList = new Set();  // OfferIds
    }

    getUserId(){
        return this._userId;
    }

    getLoginServiceId(){
        return this._loginServiceId;
    }

    getProperties(){
        return {
            userId:this._userId,
            loginServiceId:this._loginServiceId,
            firstName:this._firstName,
            lastName:this._lastName,
            email:this._email
        }
    }

    getSellList(){
        return Array.from(this._sellList);
    }

    getBuyList(){
        return Array.from(this._buyList);
    }

    addSellOffer(offerId){
        this._sellList.add(offerId);
    }

    addBuyOffer(offerId){
        this._buyList.add(offerId);
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

    getSellList(){
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

    getBuyList(){

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
            res = this._selTree.find(node);
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
        this._type;
    }

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
}


exports.User = User;
exports.TreeNode = TreeNode;
exports.VideoGame = VideoGame;
exports.Offer = Offer;
exports.IdMap = IdMap;