import { Client } from 'pg';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH,PUT,DELETE",
  "Content-Type": "application/json"
};

export async function handler(req, res) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PATCH, PUT, DELETE');

  try {
    if (req.method === 'GET') {
      const result = await client.query('SELECT * FROM tbl_users');
      res.status(200).json(result.rows);
    } else if (req.method === 'POST') {
      const { firstname, lastname, username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await client.query('INSERT INTO tbl_users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) RETURNING *', [firstname, lastname, username, hashedPassword]);
      res.status(201).json(result.rows[0]);
    } else if (req.method === 'PUT') {
      const { id, firstname, lastname, password } = req.body;
      let query = 'UPDATE tbl_users SET firstname = $1, lastname = $2';
      const queryParams = [firstname, lastname];

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = $3';
        queryParams.push(hashedPassword);
      }

      query += ' WHERE id = $4 RETURNING *';
      queryParams.push(id);

      const result = await client.query(query, queryParams);

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      const { id } = req.body;
      const result = await client.query('DELETE FROM tbl_users WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json(result.rows[0]);
    } else {
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
