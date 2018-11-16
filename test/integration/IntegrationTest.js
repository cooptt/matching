const axios = require('axios');

class IntegrationTest {
  async loadUsers(numberUsers){
      let newUsers = [];
      let start = new Date();
      for(let i=0;i<numberUsers;i++){
          const response = await axios.post(`http://localhost:8080/signin?loginServiceId=${i}`);
          if(response.data.res === 'New user registered Succesfully'){
              newUsers.push(response.data.data.userId);
          }else{
            console.log(response.data);
          }
      }

      let end = new Date();
      console.log(`${newUsers.length} users registered / ${numberUsers}  attemps`);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return newUsers;
  }
  async updateUsers(users){
      let numberUsers = users.length;
      let start = new Date();
      let count = 0;
      for(let i=0;i<numberUsers;i++){
          let userId = users[i];
          const response = await axios.post(`http://localhost:8080/updateUserProperties?userId=${userId}`,{
              firstName: `Name${i}`,
              lastName: `LastName${i}`,
              email: `email${i}@gmail.com`,
          });
          if(response.data.data === 'User Properties updated'){
            count ++;
          }
      }
      let end = new Date();
      console.log(`${count} users updated / ${numberUsers} attemps`);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return users;
  }
  async addOffers(users){
      let numberUsers = users.length;
      const videoGamesList = await axios.get('http://localhost:8080/getCatalogue');
      let videoGames = videoGamesList.data.data;
      let total = 0,count = 0;

      let start = new Date();
      for(let i=0;i<numberUsers;i++){
          let userId = users[i];
          let value = Math.floor(Math.random() * 5);
          let type = Math.floor(Math.random() * 2);

          if(type==0){
                let price = Math.floor(Math.random()*500) + 500;
                const response = await axios.post(`http://localhost:8080/addSellOffer?userId=${userId}&videoGameId=${value}&price=${price}`);
                total ++;
                if(response.data.data === 'Offer Added'){
                  count ++;
                }
          }else{
                let price = Math.floor(Math.random()*500) + 500;
                const response = await axios.post(`http://localhost:8080/addBuyOffer?userId=${userId}&videoGameId=${value}&price=${price}`);
                total ++;
                if(response.data.data === 'Offer Added'){
                  count ++;
                }
          }

      }
      let end = new Date();
      console.log(`${count} offers added / ${total} attemps `);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return users;
  }
  async getBuyOffersByUser(users){
      let numberUsers = users.length;
      let count = 0;

      let start = new Date();
      for(let i=0;i<numberUsers;i++){
          let userId = users[i];
          const response2 =  await axios.get(`http://localhost:8080/getUserBuyList?userId=${userId}`);
          if(Array.isArray(response2.data.data)){
            count ++;
          }
      }
      let end = new Date();
      console.log('Buy Offers by User');
      console.log(`${count} offers get / ${numberUsers} requested `);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return users;
  }


  async getSellOffersByUser(users){
      let numberUsers = users.length;
      let count = 0;

      let start = new Date();
      for(let i=0;i<numberUsers;i++){
          let userId = users[i];

          const response = await axios.get(`http://localhost:8080/getUserSellList?userId=${userId}`);
          if(Array.isArray(response.data.data)){
            count ++;
          }
      }
      let end = new Date();
      console.log('Sell Offers by User');
      console.log(`${count} offers get / ${numberUsers} requested `);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return users;
  }



  async getRankedUsers(users){
      let numberUsers = users.length;
      let count = 0;

      let start = new Date();
      for(let i=0;i<numberUsers;i++){
          let userId = users[i];

          const response = await axios.get(`http://localhost:8080/getRankedUsers?userId=${userId}`);
          if(Array.isArray(response.data.data)){
            count ++;
          }
      }
      let end = new Date();
      console.log('Ranked users');
      console.log(`${count}/ ${numberUsers} `);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return users;

  }

  async getRankedUsersByBenefit(users){
      let numberUsers = users.length;
      let count = 0;

      let start = new Date();
      for(let i=0;i<numberUsers;i++){
          let userId = users[i];

          const response = await axios.get(`http://localhost:8080/getRankedUsersByBenefit?userId=${userId}`);
          if(Array.isArray(response.data.data)){
            count ++;
          }
      }
      let end = new Date();
      console.log('Ranked users by benefit');
      console.log(`${count}/ ${numberUsers} `);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return users;

  }


  async getTriplets(users){
      let numberUsers = users.length;
      let count = 0;

      let start = new Date();
      for(let i=0;i<numberUsers;i++){
          let userId = users[i];

          const response = await axios.get(`http://localhost:8080/getTriplets?userId=${userId}`);
          if(Array.isArray(response.data.data)){
            count ++;
          }
      }
      let end = new Date();
      console.log('Triplets:');
      console.log(`${count}/ ${numberUsers} `);
      console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
      return users;

  }

  runIntegrationTestsComponents(numberUsers){
    this.loadUsers(numberUsers)
    .then( (response)=>{
        return this.updateUsers(response)
    })
    .then( response =>{
        return this.addOffers(response);
    })
    .then( response =>{
        return this.getBuyOffersByUser(response);
    })
    .then( response =>{
        return this.getSellOffersByUser(response);
    })
    .then( response=>{
        return this.getRankedUsers(response);
    })
    .then( response=>{
        return this.getRankedUsersByBenefit(response);
    })
    .then( response=>{
        return this.getTriplets(response);
    })
    .catch ( error => {
        console.log('Error: ',error);
    })
  }


}

class IntegrationTestComponents{
    async loadUsers(numberUsers){
        let newUsers = [];
        let start = new Date();
        for(let i=0;i<numberUsers;i++){
            const response = await axios.post(`http://localhost:8080/signin?loginServiceId=${i}`);
            if(response.data.res === 'New user registered Succesfully'){
                newUsers.push(response.data.data.userId);
            }
        }

        let end = new Date();
        console.log(`${newUsers.length} users registered / ${numberUsers}  attemps`);
        console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
        return newUsers;
    }
    async updateUsers(users){
        let numberUsers = users.length;
        let start = new Date();
        let count = 0;
        for(let i=0;i<numberUsers;i++){
            let userId = users[i];
            const response = await axios.post(`http://localhost:8080/updateUserProperties?userId=${userId}`,{
                firstName: `Name${i}`,
                lastName: `LastName${i}`,
                email: `email${i}@gmail.com`,
            });
            if(response.data.data === 'User Properties updated'){
              count ++;
            }
        }
        let end = new Date();
        console.log(`${count} users updated / ${numberUsers} attemps`);
        console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
        return users;
    }
    async addOffers(users){
        let numberUsers = users.length;
        const videoGamesList = await axios.get('http://localhost:8080/getCatalogue');
        let videoGames = videoGamesList.data.data;
        let total = 0,count = 0;

        let start = new Date();
        for(let i=0;i<numberUsers;i++){
            let userId = users[i];

            for(let j=0;j<videoGames.length;j++){
                let value = Math.floor(Math.random() * 2);
                // 0 sell
                // 1 buy
                if(value==0){
                      let price = Math.floor(Math.random()*900) + 100;
                      const response = await axios.post(`http://localhost:8080/addSellOffer?userId=${userId}&videoGameId=${videoGames[j].videoGameId}&price=${price}`);
                      total ++;
                      if(response.data.data === 'Offer Added'){
                        count ++;
                      }
                }else{
                      let price = Math.floor(Math.random()*900) + 100;
                      const response = await axios.post(`http://localhost:8080/addBuyOffer?userId=${userId}&videoGameId=${videoGames[j].videoGameId}&price=${price}`);
                      total ++;
                      if(response.data.data === 'Offer Added'){
                        count ++;
                      }
                }
            }
        }
        let end = new Date();
        console.log(`${count} offers added / ${total} attemps `);
        console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
        return users;
    }
    async getOffersByUser(users){
        let numberUsers = users.length;
        let count = 0;

        let start = new Date();
        for(let i=0;i<numberUsers;i++){
            let userId = users[i];

            const response = await axios.get(`http://localhost:8080/getUserSellList?userId=${userId}`);
            if(Array.isArray(response.data.data)){
              count ++;
            }

            const response2 =  await axios.get(`http://localhost:8080/getUserBuyList?userId=${userId}`);
            if(Array.isArray(response2.data.data)){
              count ++;
            }
        }
        let end = new Date();
        console.log(`${count} offers get / ${2*numberUsers} requested `);
        console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
        return users;
    }
    async getOffersByVideoGame(users){
        let numberUsers = users.length;
        let count = 0;
        const videoGamesList = await axios.get('http://localhost:8080/getCatalogue');
        let videoGames = videoGamesList.data.data;

        let start = new Date();
        for(let i=0;i<videoGames.length;i++){
            console.log(videoGames[i]);
            const response1 = await axios.get(`http://localhost:8080/getVideoGameSellList?videoGameId=${videoGames[i].videoGameId}`)
            const response2 = await axios.get(`http://localhost:8080/getVideoGameBuyList?videoGameId=${videoGames[i].videoGameId}`)
            count +=2;
        }
        let end = new Date();
        console.log(`Get offers of ${videoGames.length} videogames, ${count} requests`);
        console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
        return users;
    }

    runIntegrationTestsComponents(numberUsers){
      this.loadUsers(numberUsers)
      .then( (response)=>{
          return this.updateUsers(response)
      })
      .then( response =>{
          return this.addOffers(response);
      })
      .then( response =>{
          return this.getOffersByUser(response);
      })
      .then( response=>{
          return this.getOffersByVideoGame(response);
      })
      .catch ( error => {
          console.log('Error: ',error);
      })
    }
}

class IntegrationTestBestMatchings{
    async addUsers(){
      let integrationTest = new IntegrationTestComponents();
      const users = await integrationTest.loadUsers(3)
      const usersUpdated = await integrationTest.updateUsers(users);

    }
    async addOffers(users){
        // USER 0
        const user0AddOffer1 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${0}&videoGameId=${0}&price=${500}`);
        const user0AddOffer2 = await axios.post(`http://localhost:8080/addSellOffer?userId=${0}&videoGameId=${1}&price=${500}`);
        const user0AddOffer3 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${0}&videoGameId=${2}&price=${500}`);
        const user0AddOffer4 = await axios.post(`http://localhost:8080/addSellOffer?userId=${0}&videoGameId=${3}&price=${500}`);
        const user0AddOffer5 = await axios.post(`http://localhost:8080/addSellOffer?userId=${0}&videoGameId=${4}&price=${500}`);

        console.log(user0AddOffer1.data.data);
        console.log(user0AddOffer2.data.data);
        console.log(user0AddOffer3.data.data);
        console.log(user0AddOffer4.data.data);
        console.log(user0AddOffer5.data.data);



        // USER 1
        const user1AddOffer1 = await axios.post(`http://localhost:8080/addSellOffer?userId=${1}&videoGameId=${0}&price=${500}`);
        const user1AddOffer2 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${1}&videoGameId=${1}&price=${500}`);
        const user1AddOffer3 = await axios.post(`http://localhost:8080/addSellOffer?userId=${1}&videoGameId=${2}&price=${500}`);
        const user1AddOffer4 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${1}&videoGameId=${3}&price=${500}`);
        const user1AddOffer5 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${1}&videoGameId=${4}&price=${500}`);

        console.log(user1AddOffer1.data.data);
        console.log(user1AddOffer2.data.data);
        console.log(user1AddOffer3.data.data);
        console.log(user1AddOffer4.data.data);
        console.log(user1AddOffer5.data.data);


        // USER 2
        const user2AddOffer1 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${2}&videoGameId=${1}&price=${600}`);
        const user2AddOffer2 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${2}&videoGameId=${3}&price=${600}`);
        const user2AddOffer3 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${2}&videoGameId=${4}&price=${600}`);

        console.log(user2AddOffer1.data.data);
        console.log(user2AddOffer2.data.data);
        console.log(user2AddOffer3.data.data);
    }
    async getRankedUsers(){
        const rankedUsers = await axios.get(`http://localhost:8080/getRankedUsers?userId=${0}`);
        console.log('Users order by number of matchings');
        console.log(rankedUsers.data);
        console.log('Users order by benefit');
        const rankedUsersByBenefit = await axios.get(`http://localhost:8080/getRankedUsersByBenefit?userId=${0}`)
        console.log(rankedUsersByBenefit.data);
    }
    runIntegrationTestBestMatchings(){
        this.addUsers()
        .then( ()=>{
            return this.addOffers()
        })
        .then ( ()=>{
            return this.getRankedUsers();
        })
        .catch( (error)=>{
            console.log(error);
        })
    }



}


class IntegrationTestTriplets{
  async addUsers(){
    let integrationTest = new IntegrationTestComponents();
    const users = await integrationTest.loadUsers(3)
    const usersUpdated = await integrationTest.updateUsers(users);
    return users;
  }
  async addOffers(users){
      // USER 0
      const user0AddOffer1 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${0}&videoGameId=${2}&price=${100}`);
      const user0AddOffer2 = await axios.post(`http://localhost:8080/addSellOffer?userId=${0}&videoGameId=${0}&price=${100}`);

      console.log(user0AddOffer1.data.data);
      console.log(user0AddOffer2.data.data);



      // USER 1
      const user1AddOffer1 = await axios.post(`http://localhost:8080/addSellOffer?userId=${1}&videoGameId=${1}&price=${100}`);
      const user1AddOffer2 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${1}&videoGameId=${0}&price=${100}`);

      console.log(user1AddOffer1.data.data);
      console.log(user1AddOffer2.data.data);


      // USER 2
      const user2AddOffer1 = await axios.post(`http://localhost:8080/addBuyOffer?userId=${2}&videoGameId=${1}&price=${100}`);
      const user2AddOffer2 = await axios.post(`http://localhost:8080/addSellOffer?userId=${2}&videoGameId=${2}&price=${100}`);

      console.log(user2AddOffer1.data.data);
      console.log(user2AddOffer2.data.data);
  }
  async getTriplets(){
      const triplets = await axios.get(`http://localhost:8080/getTriplets?userId=${0}`);
      console.log('Triplets');
      console.log(triplets.data.data);
  }
  runIntegrationTestTriplets(){
      this.addUsers()
      .then( ()=>{
          return this.addOffers()
      })
      .then ( ()=>{
          return this.getTriplets();
      })
      .catch( (error)=>{
          console.log(error);
      })
  }
}


const main = () =>{
  let x = new IntegrationTest();
  x.runIntegrationTestsComponents(1000);
}

main();
