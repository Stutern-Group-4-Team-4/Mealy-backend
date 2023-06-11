//Randomly generate a mock allTables JSON file
// const fs = require('fs')
// const numTables = Math.floor(Math.random()*10)+16
// const mockTables = []
// for(i=1; i<numTables; i++){
//     const chairs = Math.floor(Math.random()*6)+2
//     const name = `Table ${i}`
//     const location= ['Ground floor', 'First floor'](Math.floor(Math.random()*2))

//     mockTables.push({
//         name: name,
//         capacity: chairs,
//         isAvailable: true,
//         location: location
//     })
// }

// const data = JSON.stringify({
//     tables: mockTables
// });
// fs.writeFileSync(__dirname + '/allTables.json', data)