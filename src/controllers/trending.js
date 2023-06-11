//created an algorithm to find out the more popular(trending) foods by orders
function calculatePopularity(orders, views){
    const orderWeight = 0.7;
    const viewWeight = 0.3;
    const totalWeight = orderWeight + viewWeight;

    const popularity = (orders * orderWeight + views * viewWeight) / totalWeight;

    return popularity
}

// const potatoSalad = {
//     orders: 250,
//     views: 500
// }
// const spagBolognese = {
//     orders: 50,
//     views: 520
// }

// const P_S_Popularity = calculatePopularity(potatoSalad.orders, potatoSalad.views)
// console.log(P_S_Popularity)
// const S_B_Popularity = calculatePopularity(spagBolognese.orders, spagBolognese.views)
// console.log(S_B_Popularity) //potatoSalad is more popular than spagBolognese as it has a higher popularity score of 325 to 191