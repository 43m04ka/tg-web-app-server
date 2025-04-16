// require('dotenv').config();
// const sequelize = require('./db.js')
// const UserModel = require('./models.js').Users;
// const UserModel1 = require('./models.js').User;
//
// const start = async ()  =>{
//     await sequelize.authenticate()
//     await sequelize.sync()
//
//     await UserModel1.findAll().then(users => {
//         users.map(async user => {
//             console.log(user.dataValues)
//
//         })
//     })
//
//     const userDb = await UserModel1.findByPk(133);
//     userDb.freeGameId = -1
//     await userDb.save();
//
//     // try {
//     //     await UserModel1.findAll().then(async users => {
//     //         users.map(async user => {
//     //             if (!user) return console.log("User not found");
//     //             await user.getOrders().then(async orders => {
//     //                 for (order of orders) {
//     //                     let orderData = {id: order.id, summa: order.summa, date: order.date, body: []}
//     //                     if(order.id === 83) {
//     //                         console.log(order, user)
//     //                     }
//     //                     await order.getOrderPositions().then(async orderPoss => {
//     //                         for (orderPos of orderPoss) {
//     //                             orderData.body = [...orderData.body, orderPos.body]
//     //                         }
//     //                     })
//     //                         .catch(err => console.log(err));
//     //                 }
//     //             })
//     //                 .catch(err => console.log(err));
//     //         })
//     //     }).catch(err => console.log(err));
//     // } catch (e) {
//     //
//     // }
//
//
// }
// start()
//


let test = () =>{
    return [1, 2, 3]
}

console.log(test()[2])