import { AppDataSource } from "./src/dataSource/dataSource";
AppDataSource.initialize()
  .then(async () => {
    const migrationName = process.argv[2];
    if (!migrationName) {
      console.error("Please provide a migration name!");
      process.exit(1);
    }
    await AppDataSource.runMigrations();
    console.log("Migrations executed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during migration:", error);
    process.exit(1);
  });
