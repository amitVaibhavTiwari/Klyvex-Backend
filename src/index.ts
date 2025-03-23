import "reflect-metadata";
import cors from "cors";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./dataSource/dataSource.js";
import { AccountUserResolver } from "./resolvers/UserResolver/AccountUserResolver.js";

const PORT = process.env.PORT || 4000;

const startGraphQlServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const schema = await buildSchema({
      resolvers: [AccountUserResolver],
      validate: true,
    });

    const server = new ApolloServer({
      schema,
      introspection: true,
    });

    await server.start();

    const app = express();
    app.use(
      cors({
        origin: function (origin, callback) {
          callback(null, true); // Allow all origins
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    // Applying Apollo middleware to Express
    app.use(
      "/graphql",
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({
          // Add any custom context here (e.g., user auth)
          dataSource: AppDataSource,
        }),
      })
    );

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Error starting the server: ", error);
  }
};

startGraphQlServer();
