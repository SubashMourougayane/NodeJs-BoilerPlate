const Todo = require('../../models/todo');


const todoResolver = {
    Query: {
        todoById: async (root, args, { req, res }, info) => {
            if (req.user) {
                return await Todo.findOne({
                    where: {
                        id: args.id
                    }
                })
            } else {
                return null
            }
        },
        deleteTodo : async(root, args, {req,res}, info ) => {
            if(req.user){
                let deleteData = await Todo.destroy({
                    where : {
                        id : args.id
                    }
                })
                if(deleteData === 1){

                    return {ok : true}
                }else{
                    return {ok : false}
                }
                
            }else{
                return null;
            }
        }
    },
    Mutation: {
        createTodo: async (root, args, { req, res }, info) => {

            if (req.user) {
                args['user_id'] = req.user.id;
                let todoData = await Todo.create(args);
                return todoData.dataValues;


            } else {
                // DB error
            }
        },

        updateTodo: async (root, args, { req, res }, info) => {

            if (req.user) {
                let todoId = args.id
                delete args['id'];
                try {
                    let updateTodoData = await Todo.update(
                        args,
                        {
                            where: {
                                id: todoId
                            },
                            returning: true
                        }
                    )
                    if (updateTodoData[0] === 1) {
                      
                        return updateTodoData[1][0].dataValues;
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



module.exports = todoResolver;