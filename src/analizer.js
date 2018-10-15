


// data structures
let users=[]
let mapUsers = {}
let videoGamesToBuy = []
let videoGamesToSell = []
let offerId = 0





const queryvideoGamesToBuy = (id) =>{
    let query = videoGamesToBuy.filter( (value)=>{
         return value.userId == id;
    })
    return query
}


const queryvideoGamesToSell = (id) =>{
    let query = videoGamesToSell.filter( (value)=>{
         return value.userId == id;
    })
    return query
}





const findUser = (id) => {
    let query = users.find((user)=>{
      return user.id = id
    })

    if(query!=undefined){
        let user = {
            userId:id,
            name: mapUsers[id]
        }
        return user;
    }else{
        return undefined
    }
}

const addUser = (name,id)=>{
      users.push(id);
      mapUsers[id] = name
}

const addVideoGameToSell = (name,price,userId)=>{
      let newOfferId = offerId;
      offerId +=1;
      let game = {
          offerId: newOfferId,
          name,
          price,
          userId
      }
    videoGamesToSell.push(game)
}

const addVideoGameToBuy = (name,price,userId)=>{
      let newOfferId = offerId;
      offerId +=1;
      let game = {
          offerId: newOfferId,
          name,
          price,
          userId
      }
    videoGamesToBuy.push(game)
}

module.exports = {
      findUser,
      addUser,
      queryvideoGamesToBuy,
      queryvideoGamesToSell,
      addVideoGameToBuy,
      addVideoGameToSell
}
