const { gql } = require ('apollo-server-express');

// Type Definitions
const typeDefs = gql`
    type User {
        _id: ID
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        _id: ID
        bookId: String!
        authors: [String]
        description: String!
        title: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        me: User
    }

    input SavedBook {
        authors: [String]
        description: String!
        title: String!
        bookId: String!
        image: String
        link: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(newBook: SavedBook): User
        removeBook(bookId: String!): User
    }
`

module.exports = typeDefs;