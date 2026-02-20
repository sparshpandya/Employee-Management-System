const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const app = express();

// Load environment variables from a .env file
require("dotenv").config({ path: "Env.env" });
const mongoose = require("mongoose");

// Import GraphQL type schema and resolvers
const { typeDefs, resolvers } = require("../schema/schema.js");

const PORT = process.env.API_PORT || 4000;

app.get("/", (req, res) => {
    res.send("My employee management system Server ");
});

const DB_Url = process.env.DB_URL;

const server = new ApolloServer({ typeDefs, resolvers });

server.start().then(() => {
    server.applyMiddleware({ app, path: "/graphql" });
    // Connect to the MongoDB database using Mongoose
    mongoose.connect(DB_Url);
    console.log("Db server is connected!");
    app.listen(PORT, function () {
        console.log("App started on port 4000");
    });
});
