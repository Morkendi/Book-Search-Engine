const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, { user }) => {
            if(user) {
                const userData = await User.findOne({_id: user._id})
                    .select('-__v -password')
                    .populate('savedBooks')
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPW = await user.isCorrectPassword(password);

            if(!correctPW) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { book}, { user }) => {
            if (user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: book } },
                    { new: true }
                )

                return updateUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },

        removeBook: async (parent, { bookId}, { user }) => {
            if (user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                )

                return updateUser;
            }
        }
    },
}

module.exports = resolvers;