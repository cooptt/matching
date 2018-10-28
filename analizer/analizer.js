

const analizerHelper = require("./analizerHelper");
const utils = require("./utils");
const nodemailer = require('nodemailer');
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
        var buyList = user.getSellList(); // Array of offerids
        return this._createUserOffersList(buyList);
    }
    
    getUserBuyList(userId){
        var user = this.getUser(userId);
        var buyList = user.getBuyList(); // Array of offerids
        return this._createUserOffersList(buyList);
    }

    getUserSellListWithMatching(myUserId, userId){
        var user = this.getUser(userId);
        var sellList = user.getSellList(); // Array of offerIds
        let myUser = this.getUser(myUserId);
        let myOfferIds = myUser.getBuyList();
        let matches = this._getMatching(myOfferIds, sellList);
        //console.log('matches:', matches);
        let matchingOffers = new Set();
        matches.forEach( match => {
            matchingOffers.add(match[1]);
        })
        let sellListM = sellList.map( offerId => {
            let offer = this.getOffer(offerId)
            let videoGame = this.getVideoGame(offer.getVideoGameId());
            let props = videoGame.getProperties();
            props.offerId = offerId;
            props.price = offer.getPrice();
            props.type = offer.getType();

            if( matchingOffers.has(offerId) ){
                props.matches = true;
            }else{
                props.matches = false;
            }
            return props;
        })
        return sellListM;
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
        let repeatedOfferIds = new Set();
        offerIdPairs.forEach( (offerIdPair) => {
            if( repeatedOfferIds.has(offerIdPair.outOfferId)===false ){
                let offer = this.getOffer(offerIdPair.outOfferId);
                let user = this.getUser(offer.getUserId());
                let videoGame = this.getVideoGame(offer.getVideoGameId());
                let notificationProps = user.getProperties();
                notificationProps.title = videoGame.getTitle();
                notificationProps.image = videoGame.getImage();
                notificationProps.offerId = offer.getOfferId();
                notificationProps.price = offer.getPrice();
                notificationProps.type = offer.getType();
                notifications.push(notificationProps);
                repeatedOfferIds.add(offerIdPair.outOfferId);
            }
            
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
        offersPropertiesList = offersPropertiesList.reverse();
        return offersPropertiesList;

    }

    getRankedUsers(userId){
        let user = this.getUser(userId);
        let offerIds = user.getSellList();
        offerIds = offerIds.concat(user.getBuyList());
        let ranks = this._rankUsers(userId, offerIds);
        return ranks
    }

    getUserMatchingVideoGames(userId){
        let user = this.getUser(userId);
        let offerIds = user.getSellList();
        offerIds = offerIds.concat(user.getBuyList());
        let offers = offerIds.map( id => this.getOffer(id) );
        let matchingVideoGamesIds = new Set()
        offers.forEach( offer => {
            let mOfferIds = this._getMatchingOfferIds(offer.getOfferId());
            if(mOfferIds.length>0){
                matchingVideoGamesIds.add(offer.getVideoGameId());
            }
        });

        let matchingVideoGamesProps = []
        for(let videoGameId of matchingVideoGamesIds ){
            let videoGame = this.getVideoGame(videoGameId);
            matchingVideoGamesProps.push(videoGame.getProperties());
        }
        return matchingVideoGamesProps;
    }

    /* Calculate all sell offers belonging to userId
    that matches with  offer from any other user
    returns array of objects containing properties
    of both matching users and info from the owner
    of the matching user*/
    getVideoGameSellMatches(userId, videoGameId){
        let user = this.getUser(userId);
        let offerIds = user.getSellList();
        return this._getVideoGameMatches(videoGameId, offerIds);
    }

    /* Same as getVideoGameSellMatches() but with buy Offers */
    getVideoGameBuyMatches(userId, videoGameId){
        let user = this.getUser(userId)
        let offerIds = user.getBuyList();
        return this._getVideoGameMatches(videoGameId, offerIds);
    }



    
    



    



    // Add, Update, Delete functions

    addUser(loginServiceId) {
        this._loginServiceMap.set(loginServiceId, this._users.nextId() );
        this._users.insert( new User(this._users.nextId(), loginServiceId ) );
        return this.getUserIdFromLoginServiceId(loginServiceId)
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

    addRatingToUser(ratingUserId, ratedUserId, rating){
        let ratingUser = this.getUser(ratingUserId);
        let ratedUser = this.getUser(ratedUserId);

        if( ratingUser.hasUserRating(ratedUserId) ){
            let oldRating = ratingUser.getUserRating(ratedUserId);
            ratedUser.changeMyRating(oldRating,rating);
            ratingUser.updateUserRating(ratedUserId, rating);
        } else {
            ratedUser.updateMyRating(rating);
            ratingUser.addUserRating(ratedUserId, rating);
        }
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
            videoGameProp.matches = offerIdList[i];
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
            this._sendNotification(offer.getUserId(), originOfferId);
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

    _rankUsers(userId, offerIds){
        let offers = offerIds.map( id => this.getOffer(id) );
        offers.sort( (a,b) => {
            return a.getPrice() - b.getPrice() ;
        })
        let rankings = new Map();
        let repOfferIds = new Set();
        offers.forEach( offer => {
            let mOfferIds = this._getMatchingOfferIds(offer.getOfferId());
            let mOffers = mOfferIds.map( mOfferId => this.getOffer(mOfferId) );
            mOffers.sort( (a,b) => {
                return a.getPrice() - b.getPrice();
            });

            let repUsers = new Set();
            for(let i=0;i<mOffers.length;i++){
                let mOffer = mOffers[i];
                let mUserId = mOffer.getUserId()
                if(repUsers.has(mUserId)===false
                    && repOfferIds.has(mOffer.getOfferId())===false ){
                    repUsers.add(mUserId);
                    repOfferIds.add(mOffer.getOfferId());

                    if(rankings.has(mUserId)===false){
                        rankings.set(mUserId,[/*edges*/0,/*diffAcum*/0]);
                    }

                    let preVal = rankings.get(mUserId);
                    preVal[0]++;
                    preVal[1] += Math.abs(offer.getPrice()-mOffer.getPrice());
                    rankings.set(mUserId,preVal);
                }
            }
        });
        let ranks = []
        for(let key of rankings.keys() ){
            ranks.push( [key, rankings.get(key) ] );
        }

        ranks.sort( (a,b) => {
            return b[1][0]-a[1][0];
        })

        let usersProps = []
        for(let i=0;i<ranks.length;i++){
            let obj = this.getUser(ranks[i][0]).getProperties();
            obj.matches = ranks[i][1][0];
            usersProps.push(obj);
        }
        return usersProps;
    }

    _sendEmail(mailOptions){
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'cooperativapascaltt@gmail.com',
            pass: 'Cooperativa2018' }
        });

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else { 
                console.log('Email sent: ' + info.response); }
        });
    }

    _sendNotification(userId, offerId){
        let destinationEmail = this.getUser(userId).getEmail();
        if(destinationEmail!==null){
            let offer = this.getOffer(offerId);
            let ownerUser = this.getUser(offer.getUserId());
            let videoGame = this.getVideoGame(offer.getVideoGameId());
            let text = "User " + ownerUser.getFirstName() + ' ' + ownerUser.getLastName() ;
            text += ' submitted a new offer that might be interesting to you:\n'
            if(offer.getType()===0){
                text += 'Buying '
            } else if ( offer.getType()===1 ){
                text += 'Selling '
            }
            text += videoGame.getTitle() + ' for ';
            text += '$ ' + offer.getPrice();

            let mailOptions = {
              from: 'cooperativapascaltt@gmail.com',
              to: destinationEmail,
              subject: 'New offer match',
              text: text
            };
            //this._sendEmail(mailOptions);
            //console.log(text);
        }     
    }

    /* returns true if these offer match */
    _offersMatch(offerIdA, offerIdB){
        let offerA = this.getOffer(offerIdA);
        let offerB = this.getOffer(offerIdB);
        if(offerA.getType()===this._BUY
            && offerB.getType()===this._SELL 
            && offerA.getPrice()>= offerB.getPrice() ){
            return true;
        }

        if(offerB.getType()===this._BUY
            && offerA.getType()===this._SELL 
            && offerA.getPrice()<= offerB.getPrice() ){
            return true;
        }

        return false;
    }

    _getMatching(offerIds, mOfferIds){
        offerIds.sort( (a,b) => {
            return this.getOffer(a).getPrice() - this.getOffer(b).getPrice();
        });
        mOfferIds.sort((a,b) => {
            return this.getOffer(a).getPrice() - this.getOffer(b).getPrice();
        })
        let matches = [];
        let repOfferIds = new Set();
        offerIds.forEach( offerId => {
            let repUserIds = new Set();
            mOfferIds.forEach( mOfferId => {
                if( this._offersMatch(offerId,mOfferId)){
                    let mOffer = this.getOffer(mOfferId);
                    let mUserId = this.getUser(mOffer.getUserId());
                    if( repUserIds.has(mUserId)===false 
                        && repOfferIds.has(mOfferId)===false){
                        repUserIds.add(mUserId);
                        repOfferIds.add(mOfferId);
                        matches.push([offerId,mOfferId]);
                    }
                }
            })
        })
        return matches;
    }


    /* 
        myOffer: one of my offers,
        returns the offerId of any offer matching myOffer
        belonging to matchingUserId, is there are no matches
        returns null
    */
    _getMyOfferMatching(myOfferId, matchingUserId){
        let myOffer = this.getOffer(myOfferId);
        let matchingUser = this.getUser(matchingUserId);
        let offerIds = matchingUser.getSellAndBuyList();
        for(let i=0;i<offerIds.length;i++){
            let offerId = offerIds[i]
            if(this._offersMatch(myOfferId, offerId)){
                return offerId;
            }
        }

        return null;
    }

    _getVideoGameMatches(videoGameId, offerIds){
        let offers = offerIds.map( id =>  this.getOffer(id)  );
        offers.sort( (a,b) =>{
            return a.getPrice() - b.getPrice();
        })
        let matches = []
        let repOfferIds = new Set();
        offers.forEach( offer => {
            if( offer.getVideoGameId()===videoGameId ){
                let mOfferIds = this._getMatchingOfferIds(offer.getOfferId());
                mOfferIds.sort( (a,b) => {
                    return this.getOffer(a).getPrice() - this.getOffer(b).getPrice();
                })
                let repUserIds = new Set();
                for(let i=0;i<mOfferIds.length;i++){
                    let mOfferId = mOfferIds[i];
                    let mOffer = this.getOffer(mOfferId);
                    let mUserId = this.getUser(mOffer.getUserId());
                    if( repUserIds.has(mUserId)===false && 
                        repOfferIds.has(mOfferId)===false ){
                        repOfferIds.add(mOfferId);
                        repUserIds.add(mUserId);
                        matches.push([offer.getOfferId(), mOfferId])
                    }
                }
            }
        } );

        let matchesProps = matches.map( pairIds => this._fillMatchingOffer(pairIds[0],pairIds[1]));
        return matchesProps;
    }

    _fillMatchingOffer(myOfferId, matchingOfferId){
        let myOffer = this.getOffer(myOfferId);
        let matchingOffer = this.getOffer(matchingOfferId);
        let matchingUser = this.getUser(matchingOffer.getUserId());
        return {
            myOfferId:myOffer.getOfferId(),
            myOfferPrice:myOffer.getPrice(),
            myOfferType:myOffer.getType(),
            matchingOfferId:matchingOffer.getOfferId(),
            matchingOfferPrice:matchingOffer.getPrice(),
            matchingOfferType:matchingOffer.getType(),
            matchingUserId:matchingUser.getUserId(),
            matchingUserFirstName:matchingUser.getFirstName(),
            matchingUserLastName:matchingUser.getLastName(),
            matchingUserEmail:matchingUser.getEmail()
        } 
    }

    /* returns every match for all offerIds that 
    are related with videoGameId*/
    _getVideoGameMatches(videoGameId, offerIds){
        let offers = offerIds.map( id =>  this.getOffer(id)  );
        offers.sort( (a,b) =>{
            return a.getPrice() - b.getPrice();
        })
        let matches = []
        let repOfferIds = new Set();
        offers.forEach( offer => {
            if( offer.getVideoGameId()===videoGameId ){
                let mOfferIds = this._getMatchingOfferIds(offer.getOfferId());
                mOfferIds.sort( (a,b) => {
                    return this.getOffer(a).getPrice() - this.getOffer(b).getPrice();
                })
                let repUserIds = new Set();
                for(let i=0;i<mOfferIds.length;i++){
                    let mOfferId = mOfferIds[i];
                    let mOffer = this.getOffer(mOfferId);
                    let mUserId = this.getUser(mOffer.getUserId());
                    if( repUserIds.has(mUserId)===false && 
                        repOfferIds.has(mOfferId)===false ){
                        repOfferIds.add(mOfferId);
                        repUserIds.add(mUserId);
                        matches.push([offer.getOfferId(), mOfferId])
                    }
                }
            }
        } );

        let matchesProps = matches.map( pairIds => this._fillMatchingOffer(pairIds[0],pairIds[1]));
        return matchesProps;
    }


    _getUserSellMatches(userId){
        let user = this.getUser(userId);
        let offerIds = user.getSellList();
        offerIds.sort( (a,b) => this.getOffer(a).getPrice() - this.getOffer(b).getPrice() );
        let matches = []
        let repOfferIds = new Set();
        offerIds.forEach( offerId => {
            let mOfferIds = this._getMatchingOfferIds(offerId);
            mOfferIds.sort( (a,b) => this.getOffer(a).getPrice() - this.getOffer(b).getPrice() );
            let repUserIds = new Set();
            mOfferIds.forEach( mOfferId => {
                let mOffer = this.getOffer(mOfferId);
                if( repUserIds.has(mOffer.getUserId())===false &&
                    repOfferIds.has(mOfferId)===false ){
                    repUserIds.add(mOffer.getUserId());
                    repOfferIds.add(mOfferId);
                    matches.push([offerId, mOfferId]);
                }
            } )
        })
        return matches;
    }

    _getUserBuyMatches(userId){
        let user = this.getUser(userId);
        let offerIds = user.getBuyList();
        offerIds.sort( (a,b) => this.getOffer(a).getPrice() - this.getOffer(b).getPrice() );
        let matches = []
        let repOfferIds = new Set();
        offerIds.forEach( offerId => {
            let mOfferIds = this._getMatchingOfferIds();
            mOfferIds.sort( (a,b) => this.getOffer(a).getPrice() - this.getOffer(b).getPrice() );
            let repUserIds = new Set();
            mOfferIds.forEach( mOfferId => {
                let mOffer = this.getOffer(mOfferId);
                if( repUserIds.has(mOffer.getUserId())===false &&
                    repOfferIds.has(mOfferId)===false ){
                    repUserIds.add(mOffer.getUserId());
                    repOfferIds.add(mOfferId);
                    matches.push([offerId, mOfferId]);
                }
            } )
        })
        return matches;
    }


    /*
        oUserId: Original User Id
        cUserId: Current User Id
        cCycle = Current cycle
        cycles = all cycles of length "deep"

    */
    _dfs(oUserId, cUserId, state, cycles, cCycle, deep){
        if( state===deep ){
            if( oUserId===cUserId){
                let cCycleCopy = cCycle.map( edge => edge.slice(0) );
                cycles.push(cCycleCopy);
            }
        } else{
            let edges = this._getUserSellMatches(cUserId)
            edges.forEach(edge => {
                cCycle.push(edge);
                let offer = this.getOffer(edge[1]);
                this._dfs(oUserId, offer.getUserId(), state+1, cycles, cCycle, deep );
                cCycle.pop();
            })
        }
        
    }

    _createCycleProps(cycle){
        let cycleProps = [];
        let n = cycle.length;
        cycle.forEach( (edge,i) => {
            let prevEdge = cycle[(i+n-1)%n]
            let offer = this.getOffer(edge[0]);
            let prevOffer = this.getOffer(prevEdge[0]);
            let diff = offer.getPrice() - prevOffer.getPrice();
            let user = this.getUser(offer.getUserId());
            let videoGame = this.getVideoGame(offer.getVideoGameId());

            let offerProp = {
                userId:user.getUserId(),
                firstName:user.getFirstName(),
                lastName:user.getLastName(),
                videoGameId:videoGame.getVideoGameId(),
                title:videoGame.getTitle(),
                image:videoGame.getImage(),
                offerId:offer.getOfferId(),
                price:offer.getPrice(),
                diff:diff
            }
            cycleProps.push(offerProp);
        })
        return cycleProps;
    }

    _getCycles(userId, deep){
        let cycles = [];
        let cCycle = [];
        this._dfs(userId, userId, 0, cycles, cCycle, deep);
        return cycles;
    }


    getTriplets(userId){
        let triplets = this._getCycles(userId,3);
        console.log(triplets);
        let tripletsProps = triplets.map( cycle => this._createCycleProps(cycle) );
        return tripletsProps;
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
