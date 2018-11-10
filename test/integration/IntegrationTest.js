const axios = require('axios');



class IntegrationTest{
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
            if(response.data.data === 'User Properties updated')
                count ++;
        }
        let end = new Date();
        console.log(`${count} users updated / ${numberUsers} attemps`);
        console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
        return users;
    }


    async addOffers(users,numberVideogames){
        let numberUsers = users.length;
        const videoGamesList = await axios.get('http://localhost:8080/getCatalogue');
        let videoGames = videoGamesList.data.data;
        let total = 0,count = 0;

        let start = new Date();
        for(let i=0;i<numberUsers;i++){
            let userId = users[i];

            for(let j=0;j<videoGames.length;j++){
                let value = Math.floor(Math.random() * 3);
                // 0 no
                // 1 offer
                // 2 buy
                if(value===1){
                      let price = Math.floor(Math.random()*900) + 100;
                      const response = await axios.post(`http://localhost:8080/addSellOffer?userId=${userId}&videoGameId=${videoGames[j].videoGameId}&price=${price}`);
                      total ++;
                      if(response.data.data === 'Offer Added')
                        count ++;
                }else if(value===2){
                      let price = Math.floor(Math.random()*900) + 100;
                      const response = await axios.post(`http://localhost:8080/addBuyOffer?userId=${userId}&videoGameId=${videoGames[j].videoGameId}&price=${price}`);
                      total ++;
                      if(response.data.data === 'Offer Added')
                        count ++;
                }
            }
        }
        let end = new Date();
        console.log(`${count} offers added / ${total} attemps `);
        console.log(`Time: ${(end.getTime()-start.getTime())/1000} seconds`);
        return users;
    }


    run(numberUsers){
      this.loadUsers(numberUsers)
      .then( (response)=>{
          return this.updateUsers(response)
      })
      .then( response =>{
          return this.addOffers(response);
      }).catch ( error => {
          console.log('Error: ',error);
      })
    }
}


const main = () =>{
  let integrationTest = new IntegrationTest();
  integrationTest.run(10);
}

main();
