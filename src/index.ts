import "reflect-metadata";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./dataSource/dataSource.js";
import { AccountUserResolver } from "./resolvers/UserResolver/AccountUserResolver.js";
import { CsrfMiddleware } from "./middlewares/CsrfMiddleware.js";
import adminRouter from "./admin_dashboard/index.js";

const PORT = process.env.PORT || 4000;

if (!process.env.ALLOWED_ORIGIN) {
  throw new Error("ALLOWED_ORIGIN is not defined in .env");
}

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
      introspection: process.env.NODE_ENV === "production" ? false : true, // this loads the graphql playground.
    });

    await server.start();
    const app = express();

    app.use(cookieParser());
    app.use(CsrfMiddleware); //  for security against csrf attacks [it works only in production environment.].

    app.use(
      cors({
        origin: process.env.ALLOWED_ORIGIN,
        // origin: function (origin, callback) {
        //   callback(null, true); // Allow all origins
        // },
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/v1/admin", adminRouter);
    app.use(
      "/graphql",
      // express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => ({
          req,
          res,
          dataSource: AppDataSource,
        }),
      })
    );

    app.listen(PORT, () => {
      console.log(`Server running at: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startGraphQlServer();
