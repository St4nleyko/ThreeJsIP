'use strict';
const db = require("../app/models");
const User = db.user;
const Portal = db.portal;
var app = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
chai.use(require('chai-string'));
chai.use(chaiHttp);
chai.should();
// Configure chai

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// // testing MODEL 
// describe('#testCreateUser', () => {
//     it("DB models: creating user in DB", (done) => {
//       User.create({
//         profile_picture: 'test',
//         password:bcrypt.hashSync('test', 8), 
//         email: 'test@test.dot',
//         username: 'mocha-test-user',
//         role:'creator'
//       }).then(user => {  
//         if (user.dataValues.role) {
//           Role.findAll({
//             where: {
//               name: {
//                 [Op.or]: user.dataValues.role
//               }
//             }
//           }).then(roles => {
//             user.setRoles(roles).then(() => {
//               res.send({ message: "User was registered successfully!" });
//             });
//           });
//         } else {
//           user.setRoles([1]).then(() => {
//             res.send({ message: "User was registered successfully!" });
//           });
//         }
//         var result = user.dataValues.username;
//         expect(result).to.equal("mocha-test-user");
//         done();
//       })

//       });
//      });
//  describe('#testGetAllUsers', () => {
//      it("DB models: test Getting all rows from table", (done) => {
//       User.findAll()
//        .then(function (data) {
//         data.forEach(element => 
//           console.log(element.dataValues.username
//             ));
//          done();
//        });
//       });

//  describe('#testFindUserPortals', () => {
//      it("DB models: test Getting custom rows from DB", (done) => {
//       Portal.findOne({where: {user_id: 10}},
//         )
//        .then(function (data) {
//          var result = data.dataValues.portal_name;
//          console.log(result+'=test2')
//            expect(result).to.equal("test2");
//          done();
//        });
//       });
//     });

//   describe('#testFindFriendsPortals', () => {
//       it("DB models: test Getting custom rows from DB", (done) => {
//         User.findOne({
//           where: {
//               id: 12  ,
//           },
//           include: [{
//             model:  db.user, as: "friends",
//             attributes: {
//               exclude: ['password','createdAt','updatedAt']
//           },
//             through: {
//               where: {
//                 accepted: 1
//               }
//             }
//           }]
//         })
//         .then(function (data) {
//           let friendsArr=[]
//           data.friends.forEach(friend => {
//             friendsArr.push(friend.id)      
//           });
      
//           console.log('friends:'+friendsArr)
//           Portal.findAll({
//             where: {
//               user_id: friendsArr,
//             },
//           })
//           .then(portal => {
//             portal.forEach(element => 
//               console.log(element.dataValues.portal_name
//             ));
//             done();
//           })
//         });
//        });
//      });

// //end testing model

// // //testing APIs and routes
// // Test to get all products with variations

  describe('#testSignInAndUpdateData', () => {
    let accesstoken;
    let newUserId;
    let user = {
      username: "mocha-test-user",
      password: "test",
  }
    it(" Routes: sign in and acquire accessToken", (done) => {
      chai.request(app)
       .post("/api/auth/signin")
       .send(user)
         .end((err, res) => {
           var result = res.body;
           accesstoken = res.body.accessToken;
           newUserId = res.body.id;
           res.status.should.equal(200);
           done();
          });
        });

      it(" Routes: Update authenticated user's data  ", (done) => {
        console.log('akces'+accesstoken)
        let newData = {
          password:'test2',
          profile_picture:"test2profilepic",
      }
        chai.request(app)
         .put('/api/updateuserdata/:newUserId')
        .set('x-access-token', accesstoken)
         .send(newData)
           .end((err, res) => {
             console.log(res)
              res.status.should.equal(200);
             done();
            });
          });
      });
  // test a route
    describe('#testAuthenticatedRoute', () => {

      });  
// //test a route
//     describe('#testSingleProductVariation', () => {
//     it("Routes: get single product via route", (done) => {
//       chai.request(app)
//        .get('/api/findSingle/1615')
//          .end((err, res) => {
//            var result = res.body.color;
//            expect(result).to.equal("pink gold");
//            done();
//           });
//         });
//       });

//end testing routes and apis
