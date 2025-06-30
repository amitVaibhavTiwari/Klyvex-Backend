import "reflect-metadata";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { AppDataSource } from "./dataSource/dataSource.js";
import { AccountUserResolver } from "./resolvers/UserResolver/AccountUserResolver.js";
import adminRouter from "./admin_dashboard/index.js";
import { ProductCategoryResolver } from "./resolvers/ProductCategoryResolver/ProductCategoryResolver.js";
import { ProductResolver } from "./resolvers/ProductResolver/ProductResolver.js";
import { ShopMetaResolver } from "./resolvers/ShopMeta/ShopMetaResolvers.js";

const PORT = process.env.PORT || 4000;

if (!process.env.ALLOWED_ORIGIN) {
  throw new Error("ALLOWED_ORIGIN is not defined in .env");
}

const startGraphQlServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const schema = await buildSchema({
      resolvers: [
        AccountUserResolver,
        ProductCategoryResolver,
        ProductResolver,
        ShopMetaResolver,
      ],
      validate: true,
    });

    const server = new ApolloServer({
      schema,
      introspection: process.env.NODE_ENV === "production" ? false : true, // this loads the graphql playground.
    });

    await server.start();
    const app = express();

    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/v1/admin", adminRouter); // this is seperate admin router for admin dashboard. Any other middleware or routes related to admin dashboard are added inside this router. (middlewares that are added below this line, will not be applied to this router. These below middlewares are for graphql server only.)

    app.use(
      cors({
        origin: process.env.ALLOWED_ORIGIN,
        // origin: function (origin, callback) {
        //   callback(null, true);
        // },
        // if u wanna allow all origins, uncomment this line and comment the above line.
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization","x-csrf-token"],
        credentials: true,
      })
    );
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
