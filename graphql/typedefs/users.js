const gql =  require('graphql-tag');

const user = gql`
    type User{
        id : Int!,
        user_name : String!
        email : String!
        password : String
        token : String
    }

    type Mutation {
        registerUser (
            user_name  : String!
            email : String!
            password : String
        ) : User!
        
        updateUser (
            user_name : String
            email : String
            password : String
        ): User!
       
    }

    type Query {
        userById(id:Int!):User!
        login (
            email : String!
            password : String!
        ) : User!

    }


`

module.exports = user;