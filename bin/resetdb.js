// load .env data into process.env
require('dotenv').config();

// other dependencies
const fs = require('fs');
const chalk = require('chalk');
const db = require('../db/connection');

// Helper function to load files in a specific folder
const loadFiles = async (folderPath, fileType) => {
  const filenames = fs.readdirSync(folderPath).filter((fn) => fn.endsWith('.sql'));
  console.log(chalk.cyan(`-> Loading ${fileType} Files ...`));

  for (const fn of filenames) {
    const sql = fs.readFileSync(`${folderPath}/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await db.query(sql).catch((err) => {
      console.error(chalk.red(`Failed to run ${fn}: ${err.message}`));
      throw err;
    });
  }
};

// Function to run schema files (in correct order)
const runSchemaFiles = async () => {
  await loadFiles('./db/schema', 'Schema');
};

// Function to run seed files (in correct order)
const runSeedFiles = async () => {
  await loadFiles('./db/seeds', 'Seed');
};

// Main function to reset the database
const runResetDB = async () => {
  try {
    // Check database connection
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
      throw new Error('Missing required environment variables (DB_HOST, DB_USER, DB_NAME)');
    }

    console.log(
      chalk.blue(
        `-> Connecting to PG on ${process.env.DB_HOST}:${process.env.DB_PORT || 5432} as ${
          process.env.DB_USER
        }...`
      )
    );

    // Run schema and seed files
    await runSchemaFiles();
    await runSeedFiles();

    console.log(chalk.green('-> Database reset successfully!'));
    process.exit(0);
  } catch (err) {
    console.error(chalk.red(`Failed to reset database: ${err.message}`));
    process.exit(1);
  }
};

// Run the reset database script
runResetDB();

