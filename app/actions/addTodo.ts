"use server";

import { Pool } from "pg";
import { TodoItem } from "../../lib/types";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

function wrapTextRegex(text: string, maxLength: number) {
  // The regex to find chunks of text up to maxLength that end in a space or end of string.
  const regex = new RegExp(`.{1,${maxLength}}(\\s+|$)`, "g");

  const lines = text.match(regex);

  // Trim each line and join them with a newline character.
  return lines ? lines.map((line) => line.trim()).join("\n") : text;
}

export const addTodo = async (formData: TodoItem) => {
  const todo = {
    priority: formData.priority,
    description: wrapTextRegex(formData.description, 44),
    url: formData.url,
  };

  const res = await query(
    "INSERT INTO to_print (priority, description, url) VALUES ($1, $2, $3) RETURNING *",
    [todo.priority, todo.description, todo.url]
  );

  return res.rows[0];
};
