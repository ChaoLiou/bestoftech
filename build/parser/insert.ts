import * as sqlite3 from "sqlite3";

const db = new sqlite3.Database("build/db/index.db");

db.run(`CREATE TABLE company (
  id   VARCHAR PRIMARY KEY,
  name STRING,
  link STRING,
  type VARCHAR
);
`);

db.run(`CREATE TABLE job (
  id         VARCHAR PRIMARY KEY,
  company_id VARCHAR REFERENCES company (id),
  name       STRING,
  link       STRING,
  location   STRING
);
`);

db.run(`
CREATE TABLE job_detail (
  job_id            VARCHAR REFERENCES job (id) 
                            PRIMARY KEY,
  work_content      TEXT,
  other_requirement TEXT,
);
`);

// db.run(
//   `INSERT INTO company ("id","name","link","type") VALUES ("id","name","link","type")`
// );

// db.run(`DROP TABLE company`);
