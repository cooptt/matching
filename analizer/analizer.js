

const analizerHelper = require("./analizerHelper");
const utils = require("./utils");
const nodemailer = require('nodemailer');
const analizerPersitance = require('./analizerPersistance')
const AnalizerPersistance = analizerPersitance.AnalizerPersistance;
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
        this._userImagesCount = 10;
    }



    // CONFIGURATION

    loadCatalogueFromFolders(cataloguePath) {
        console.log('Loading videogames from folders ...')
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

    startPersistance(){
        this._persistance = new AnalizerPersistance();
        this._persistance.connect('localhost','root','cooperativa2018','analizer');
    }

    stopPersistance(){
        this._persistance.end();
        delete this._persistance;
    }

    clearDatabase(){
        let promises = [];
        promises.push(this._persistance.clearRatings());
        promises.push(this._persistance.clearMessages());
        promises.push(this._persistance.clearOffers());
        promises.push(this._persistance.clearVideoGames());
        promises.push(this._persistance.clearUsers());


        Promise.all(promises).then( results => {
            console.log('Clearing Database ...')
        })
    }

    loadDB(){
        this._loadUsersFromDB().then( () => {
            this._loadVideoGamesFromDB().then( () => {
                this._loadOffersFromDB().then( () => {
                    this._loadRatingsFromDB().then( () => {
                        console.log('Database loaded ...')
                    })
                })
            })
        })



    }




    // USER

    loginServiceIdExists(loginServiceId){
        return this._loginServiceMap.has(loginServiceId);
    }

    userIdExists(userId){
        return this._users.has(userId);
    }

    addUser(loginServiceId) {
        let userId = this._users.nextId();
        let userImage = 'Fotos/profile' + (userId%this._userImagesCount+1) + '.png'
        this._loginServiceMap.set(loginServiceId, userId );
        let user = new User(userId, loginServiceId );
        user.updateProperties({userImage:userImage})
        this._users.insert(user);
        if( this._persistance!==undefined ){
            this._persistance.addUser( this.getUser(userId).getProperties() );
        }
        return userId;
    }

    addRatingToUser(ratingUserId, ratedUserId, rating){
        let ratingUser = this.getUser(ratingUserId);
        let ratedUser = this.getUser(ratedUserId);

        if( ratingUser.hasUserRating(ratedUserId) ){
            let oldRating = ratingUser.getUserRating(ratedUserId);
            ratedUser.changeMyRating(oldRating,rating);
            ratingUser.updateUserRating(ratedUserId, rating);
            if( this._persistance!==undefined ){
                this._persistance.updateRating(ratingUserId, ratedUserId, rating);
                this._persistance.updateUser( { userId:ratedUserId, rating:ratedUser.getMyRating() } );
            }
        } else {
            ratedUser.updateMyRating(rating);
            ratingUser.addUserRating(ratedUserId, rating);
            if( this._persistance!==undefined ){
                this._persistance.addRating(ratingUserId, ratedUserId, rating);
                this._persistance.updateUser( { userId:ratedUserId, rating:ratedUser.getMyRating() } );
            }
        }
    }

    updateUserProperties(userId, properties){
        this.getUser(userId).updateProperties(properties);
        if( this._persistance!==undefined ){
            properties.userId = userId;
            this._persistance.updateUser(properties);
        }
    }

    getUserIdFromLoginServiceId(loginServiceId){
        return this._loginServiceMap.get(loginServiceId);
    }

    getUsersSize(){
        return this._users.size();
    }

    getUserProperties(userId){
        let user = this.getUser(userId);
        return user.getProperties();
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






    // VIDEOGAME

    videoGameIdExists(videoGameId){
        return this._catalogue.has(videoGameId);
    }

    getCatalogue() {
        let catalogue = [];
        this._catalogue.getValues().forEach( videoGame => catalogue.push(videoGame.getProperties()) )
        return catalogue;
    }

    getCatalogueSize(){
        return this._catalogue.size();
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




    // OFFER

    offerIdExists(offerId){
        return this._offers.has(offerId);
    }

    addSellOffer(userId, videoGameId, price) {
        let offer = new Offer(this._offers.nextId(), userId, videoGameId, price, this._SELL)
        let offerId = this._offers.insert(offer);
        this.getUser(userId).addSellOffer(offerId);
        this.getVideoGame(videoGameId).addSellOffer(offerId, price);
        if( this._persistance!==undefined ){
            this._persistance.addOffer( offer.getProperties() );
        }
        let offerIds = this._getMatchingOfferIds(offerId);
        this._createNotifications(offerId, offerIds);
    }

    addBuyOffer(userId, videoGameId, price) {
        let offer = new Offer(this._offers.nextId(), userId, videoGameId, price, this._BUY) ;
        var offerId = this._offers.insert(offer);
        this.getUser(userId).addBuyOffer(offerId);
        this.getVideoGame(videoGameId).addBuyOffer(offerId, price);
        if( this._persistance!==undefined ){
            this._persistance.addOffer( offer.getProperties() );
        }
        let offerIds = this._getMatchingOfferIds(offerId);
        this._createNotifications(offerId, offerIds);
    }

    getOffersSize(){
        return this._offers.size();
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

    deleteOffer(offerId) {
        var offer = this.getOffer(offerId);
        this.getUser(offer.getUserId()).deleteOffer(offerId);
        this.getVideoGame(offer.getVideoGameId()).deleteOffer(offerId, offer.getType(), offer.getPrice());
        let offerIds = this._getMatchingOfferIds(offerId);
        this._removeNotifications(offerId, offerIds);
        this._offers.remove(offerId);
        if( this._persistance!==undefined ){
            this._persistance.deleteOffer(offerId);
        }
    }



    // CHAT

    /* returns a Promise with userProps,
     call .then( userProps => { do stuff with userProps } ); */
    getChatUsers(userId){
        let response = this._persistance.getChatIds(userId);
        return response.then( result => {
            //console.log(result);
            let idPairs = result.result;
            let ids = new Set();
            idPairs.forEach( idPair => {
                if( idPair.srcUserId !== userId ){
                    ids.add(idPair.srcUserId);
                }

                if( idPair.destUserId !== userId ){
                    ids.add(idPair.destUserId);
                }
            })
            let userIds = Array.from(ids);
            //console.log(ids);
            let userProps = userIds.map( userId => this.getUser(userId).getProperties() );

            return userProps;
        })
    }

    addMessage(rscUserId, destUserId, content){
        let dateMillis = (new Date()).getTime();
        let response = this._persistance.addMessage(rscUserId, destUserId, dateMillis, content);
    }

    /* Returns a Promise with an array of messages;
     call .then ( messages => {do stuff with messages} ); */
    getConversation(userId, mUserId){
        let response = this._persistance.getConversation(userId, mUserId);
        return response.then( result => {
            return  result.result
        })
    }




    // RANKING AND TRIPLETS

    getRankedUsers(userId){
        let user = this.getUser(userId);
        let offerIds = user.getSellList();
        offerIds = offerIds.concat(user.getBuyList());
        let ranks = this._rankUsers(userId, offerIds);


        ranks.sort( (a,b) => {
            return b[1][0]-a[1][0];
        })

        let usersProps = []
        for(let i=0;i<ranks.length;i++){
            let obj = this.getUser(ranks[i][0]).getProperties();
            obj.matches = ranks[i][1][0];
            usersProps.push(obj);
        }


        return  usersProps;
    }

    getRankedUsersByBenefit(userId){
        let user = this.getUser(userId);
        let offerIds = user.getSellList();
        offerIds = offerIds.concat(user.getBuyList());
        let ranks = this._rankUsers(userId, offerIds);


        ranks.sort( (a,b) => {
            return b[1][1]-a[1][1];
        })

        let usersProps = []
        for(let i=0;i<ranks.length;i++){
            let obj = this.getUser(ranks[i][0]).getProperties();
            obj.benefit = ranks[i][1][1];
            usersProps.push(obj);
        }

        return  usersProps;
    }

    getTriplets(userId){
        let triplets = this._getCycles(userId,3);
        //console.log(triplets);
        let tripletsProps = triplets.map( cycle => this._createCycleProps(cycle) );
        return tripletsProps;
    }








    /**************************   PRIVATE ***************************************************/


    // HELPER FUNCTIONS

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
        let videoGame = new VideoGame(this._catalogue.nextId(), title, image);
        this._catalogue.insert(videoGame);
        if( this._persistance!==undefined ){
            this._persistance.addVideoGame(videoGame.getProperties());
        }
    }

    _getUsers() {
        let users = [];
        this._users.getValues().forEach( user => users.push(user.getProperties()));
        return users;
    }



    // NOTIFICATIONS

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
            this._sendEmail(mailOptions);
            console.log('Sending email: ', mailOptions);
        }
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




    // MATCHING AND RANKING

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

    /* Returns of posible relations where */
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


    _rankUsers(userId, offerIds){
        let offers = offerIds.map( id => this.getOffer(id) );
        offers.sort( (a,b) => a.getPrice() - b.getPrice() )
        let rankings = new Map();
        let repOfferIds = new Set();
        offers.forEach( offer => {
            let mOfferIds = this._getMatchingOfferIds(offer.getOfferId());
            let mOffers = mOfferIds.map( mOfferId => this.getOffer(mOfferId) );
            mOffers.sort( (a,b) => a.getPrice() - b.getPrice() );
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
        return ranks;
    }











    // TRIPLETS

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
                userImage: user.getImage(),
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





    // PERSISTANCE


    _loadUsersFromDB() {
        let response = this._persistance.loadUsers();
        return response.then( result => {
            //console.log(result);
            result.result.forEach( props => {
                let user = new User(props.userId, props.loginServiceId );
                user.updateProperties(props);
                this._users.set(props.userId, user);
                this._loginServiceMap.set(props.loginServiceId, props.userId );
            })
        })
    }

    _loadOffersFromDB(){
        let response = this._persistance.loadOffers();
        return response.then( result => {
            //console.log(result);
            result.result.forEach( props => {
                let offer = new Offer(
                    props.offerId,
                    props.userId,
                    props.videoGameId,
                    props.price,
                    props.type
                );
                if( props.type===this._BUY ){
                    this.getUser(props.userId).addBuyOffer(props.offerId);
                    this.getVideoGame(props.videoGameId).addBuyOffer(props.offerId, props.price);
                } else if ( props.type === this._SELL ){
                    this.getUser(props.userId).addSellOffer(props.offerId);
                    this.getVideoGame(props.videoGameId).addSellOffer(props.offerId, props.price);
                }
                this._offers.set(props.offerId, offer);
            })
        })
    }

    _loadVideoGamesFromDB(){
        let response = this._persistance.loadCatalogue();
        return response.then( result => {
            result.result.forEach( props => {
                let videoGame = new VideoGame(props.videoGameId, props.title, props.image );
                this._catalogue.set(props.videoGameId, videoGame );
            })
        })
    }

    _loadRatingsFromDB(){
        let response = this._persistance.loadRatings();
        return response.then( result => {
            //console.log('Ratings : ', result.result)
            result.result.forEach( props => {
                let ratedUser = this.getUser(props.ratedUserId);
                let ratingUser = this.getUser(props.ratingUserId);
                let rating = props.rating;
                ratedUser.updateMyRating(rating);
                ratingUser.addUserRating(props.ratedUserId, rating);
            })
        })
    }













    // USELESS FUNCTIONS

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

    updateOfferProperties(offerId, properties){
        //this.getOffer(offerId).updateProperties(properties);
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

    deleteUser() {

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
 
}



exports.Analizer = Analizer;
