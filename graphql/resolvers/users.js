const Users = require('../../models/users');
const Utils = require('../../utils/utils');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const userResolver = {
    Query: {
        userById: async (root, args, { req, res }, info) => {
            if (req.user) {
                return await Users.findOne({
                    where: {
                        id: args.id
                    }
                })
            } else {
                return null
                // unAuthAccess
            }
        },
        login: async (root, args, { req, res }, info) => {

            let userData = await Users.findOne({
                where: {
                    email: args.email,
                }
            })
            if (userData) {
                let loginRes = await bcrypt.compare(args.password, userData.dataValues['password']);

                if (loginRes) {

                    delete userData.dataValues['createdAt']
                    delete userData.dataValues['updatedAt']
                    delete userData.dataValues['password']

                    userData.dataValues['token'] = jwt.sign(userData.dataValues, 'shhhhh')
                    res.cookie('dcodeUser', userData.dataValues['token']);
                    return userData.dataValues;
                }
            } else {
                // wrong email

            }



        }
    },
    Mutation: {
        registerUser: async (root, args, context, info) => {
            args['password'] = await bcrypt.hash(args['password'], 10);

            let userData = await Users.create(args);

            if (userData) {
                delete userData.dataValues['password'];
                return userData.dataValues;
            } else {
                // DB error
            }
        },

        updateUser: async (root, args, { req, res }, info) => {

            if (req.user) {

                try {
                    let updatedUserData = await Users.update(
                        args,
                        {
                            where: {
                                id: req.user.id
                            },
                            returning: true
                        }
                    )
                    if (updatedUserData[0] === 1) {
                        delete updatedUserData[1][0].dataValues['password'];
                        delete updatedUserData[1][0].dataValues['createdAt'];
                        delete updatedUserData[1][0].dataValues['updatedAt'];

                        return updatedUserData[1][0].dataValues;
                    }

                } catch (error) {
                    console.log(error);
                }

            } else {
                res.send(403, "Unautharised Access")
            }
        }


    }
}



module.exports = userResolver;