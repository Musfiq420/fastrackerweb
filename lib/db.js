import { Pool } from "pg";

let conn;

// if (!conn) {
//   conn = new Pool({
//     user: "avnadmin",
//     password: "AVNS_lNyJ5bvS2m2DsLS_JLI",
//     host: "pg-12f00df0-mrifat46-9501.aivencloud.com",
//     port: 18581,
//     database: "notes",
//     ssl: {
//       rejectUnauthorized: false,
//     }
//   });
// }

// if (!conn) {
//   conn = new Pool({
//     user: "postgres",
//     password: "sgh5PHwptExPdNUN",
//     host: "db.ioypezxcdsvwvxpwzljo.supabase.co",
//     port: 5432,
//     database: "notedb",
//     ssl: {
//       rejectUnauthorized: false,
//     }
//   });
// }

export default conn ;