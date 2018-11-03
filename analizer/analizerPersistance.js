const mysql = require('mysql');

class AnalizerPersistance {

    connect(host,user,password,database){
    	this._db = mysql.createConnection({
    		host:host,
    		user:user,
    		password:password,
    		database:database
    	});

    	this._db.connect( function(err) {
    		if (err){
    			console.log("error with db");
    		} else {
    		    console.log('connections successfull')
            }

    	});
    }

    end(){
        this._db.end();
    }


    // returns a promise
    queryAnalizer(query){
        return new Promise( (resolve,reject) => {
            this._db.query(query,(error,result,fields)=>{
                if(error){
                    let response = {
                        ok: false,
                        error
                    }
                    reject(response)
                    console.log(error);
                }else{
                    let response = {
                        ok: true,
                        result
                    }
                    resolve(response)
                }
            })
        })
    }

    /*
        properties = {
            userId:4,
            loginServiceId:17,
            firstName:null,
            lastName:null,
            email:null
        }
    */
    addUser(properties){
        let query = `INSERT INTO User(userId,loginServiceId,firstName,lastName,email) VALUES \
            ("${properties.userId}","${properties.loginServiceId}","${properties.firstName}","${properties.lastName}","${properties.email}");`
        return this.queryAnalizer(query);
    }


    /*
        properties = {
            videoGameId:5,
            title:"Halo",
            image:"halo.jpg"
        }
    */
    addVideoGame(properties){
        let query = `INSERT INTO VideoGame(videoGameId,title,image) VALUES \
            ("${properties.videoGameId}","${properties.title}","${properties.image}");`;
        return this.queryAnalizer(query);
    }

    /*
        properties = {
            offerId:74,
            userId:43,
            videoGameId:3,
            price:4.58,
            type:0
        }
    */
    addOffer(properties){
      let query = `INSERT INTO Offer(offerId,userId,videoGameId,price,type) VALUES \
          ("${properties.offerId}","${properties.userId}","${properties.videoGameId}","${properties.price}","${properties.type}");`;
          return this.queryAnalizer(query);
    }

    /*
      // all attributes except userId will change
      properties{
        userId: 4,
        firstName: "newName",
        lastName: "newLastName"

      }

    */
    updateUser(properties){
      let query  = "UPDATE User SET ";

      let first = true;
      for(let value in properties){
          if(value != "userId"){
              if(first==false)
                query += ","
              query += `${value}="${properties[value]}"`;
              first = false;

          }
      }
      query += ` WHERE userId="${properties.userId}";`

      return this.queryAnalizer(query);
    }

     /*
      // all attributes except offerId will change
      properties{
        offerId: "74",
        type: "1",
        price: "212.33"

      }

    */
    updateOffer(properties){
        let query  = "UPDATE Offer SET ";

        let first = true;
        for(let value in properties){
            if(value != "offerId"){
                if(first==false)
                    query += ","
                query += `${value}="${properties[value]}"`;
                first = false;

            }
        }
        query += ` WHERE offerId="${properties.offerId}";`

        return this.queryAnalizer(query);
    }

    /*
      userId = '4'
    */
    deleteUser(userId){
        let query = `DELETE FROM User WHERE userId=${userId};`;
        return this.queryAnalizer(query);
    }

    deleteVideoGame(videoGameId){
        let query = `DELETE FROM VideoGame WHERE videoGameId=${videoGameId};`;
        return this.queryAnalizer(query);
    }

    deleteOffer(offerId){
        let query = `DELETE FROM Offer WHERE offerId=${offerId};`;
        return this.queryAnalizer(query);
    }

    // Returns All rows of User's table
    loadUsers(){
        let query = `SELECT * FROM User;`;
        return this.queryAnalizer(query);
    }

    // Returns all rows of VideoGames's table
    loadCatalogue(){
        let query = `SELECT * FROM VideoGame;`;
        return this.queryAnalizer(query);
    }

    // Returns all rows of Offer
    loadOffers(){
        let query = 'SELECT * FROM Offer;';
        return this.queryAnalizer(query);
    }

    flushUsers(){
        let query = 'delete from User ;';
        return this.queryAnalizer(query);
    }

    flushVideoGames(){
        let query = 'delete from VideoGame ;';
        return this.queryAnalizer(query);
    }

    flushOffers(){
        let query = 'delete from Offer ;';
        return this.queryAnalizer(query);
    }



    // Chat functions

    getChatIds(userId){
        let query = 'select srcUserId, destUserId from Message ';
        query += 'where srcUserId=' + userId.toString();
        query += ' or destUserId=' + userId.toString();
        query += ' ;'
        //console.log(query);
        return this.queryAnalizer(query);
    }


    getConversation(userId, mUserId){
        let query = 'select * from Message ';
        query += ' where ( srcUserId=' + userId ;
        query += ' and destUserId=' + mUserId + ' ) ';
        query += ' or ( srcUserId=' + mUserId ;
        query += ' and destUserId=' + userId + ' ) ';
        query += ' order by dateMillis desc  ;'
        console.log(query);
        return this.queryAnalizer(query);
    }

    addMessage(srcUserId, destUserId, dateMillis, content) {
        let query = ' insert into Message set '
        query += 'srcUserId=' + srcUserId.toString() + ', ';
        query += 'destUserId=' + destUserId.toString() + ', ';
        query += 'dateMillis=' + dateMillis.toString() + ', ';
        query += 'content=\"' + content + '\"'
        query += ' ;'
        return this.queryAnalizer(query);
    }
}



exports.AnalizerPersistance = AnalizerPersistance;
