import conn from "@/lib/db";

export default async function getDatafromPostgres (req, res) {
    const query = 'select * from notes';
    const result = await conn.query(query);
    console.log(result );

    res.status(200).json(result.rows)
  }