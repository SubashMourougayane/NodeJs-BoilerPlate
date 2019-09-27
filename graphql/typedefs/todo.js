const gql = require('graphql-tag');

const todo = gql`
    type Todo{
        id : Int!,
        user_id : Int!
        title : String!
        description : String!
    }

    type DeleteResponse {
        ok: Boolean!
    }
    extend type Mutation {
        createTodo (
            title : String!
            description : String
        ) : Todo!
        
        updateTodo (
            id : Int!
            title : String
            description : String
        ): Todo!
       
    }

    extend type Query {
        todoById(id:Int!):Todo!

        updateTodo (
            id : Int!
            title : String
            description : String
        ) : Todo!

        deleteTodo(
            id : Int!
        ) : DeleteResponse!

    }


`

module.exports = todo;