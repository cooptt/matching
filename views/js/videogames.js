

$( "#sellVideoGamesForm" ).on('submit',async function( event ) {
    event.preventDefault()
    let name = $('#videoGameNameSell').val()
    let price = $('#videoGamePriceSell').val()
    const newToken = await firebase.auth().currentUser.getIdToken(true)

    let response = await  fetch('/addSellOffer?userId=${userId}&videoGameId=0&price=650',{
        method: 'POST',
        headers: {
          'authorization' : newToken,
          'Accept':'application/json',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({name,price})

    });


    let id = firebase.auth().currentUser.uid

    response = await  fetch(`/user/videogames/sell/${id}`,{
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Content-Type' : 'application/json'
        }
    });
    responseJson = await response.json()

    items = $('#sellVideoGamesItems')
    items.html("")
    responseJson.forEach( game => {
        items.append(`
            <tr>
                <td> ${game.name} </td>
                <td> ${game.price} </td>
            </tr>
        `)
    })
    $("#sellVideoGamesForm").trigger("reset");
});


$( "#buyVideoGamesForm" ).on('submit',async function( event ) {
    event.preventDefault()
    let name = $('#videoGameNameBuy').val()
    let price = $('#videoGamePriceBuy').val()
    const newToken = await firebase.auth().currentUser.getIdToken(true)

    let response = await  fetch('/user/videogames/buy',{
        method: 'POST',
        headers: {
          'authorization' : newToken,
          'Accept':'application/json',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({name,price})

    });

    let id = firebase.auth().currentUser.uid

    response = await  fetch(`/user/videogames/buy/${id}`,{
        method: 'GET',
        headers: {
          'Accept':'application/json',
          'Content-Type' : 'application/json'
        }
    });
    responseJson = await response.json()

    items = $('#buyVideoGamesItems')
    items.html("")
    responseJson.forEach( game => {
        items.append(`
            <tr>
                <td> ${game.name} </td>
                <td> ${game.price} </td>
            </tr>
        `)
    })

    $("#buyVideoGamesForm").trigger("reset");
});
