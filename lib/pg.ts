import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";
import { TimetableItem } from "./types.ts";

class PgClient {
  client: Client;
  constructor() {
    this.client = new Client({
      user: "postgres",
      database: "robinrehbein",
      hostname: "127.0.0.1",
      port: 5432,
      password: "postgres",
    });
  }

  async connect(): Promise<Client> {
    if (this.client.connected) {
      return this.client;
    }
    await this.client.connect();
    return this.client;
  }

  async queryArray<K, V>(query: string): Promise<Array<[K, V]>> {
    if (!this.client.connected) {
      await this.client.connect();
    }
    const client = await this.connect();
    const { rows: rows1 } = await client.queryArray<[K, V]>(query);
    return rows1;
  }

  async queryObject<T>(query: string): Promise<Array<T>> {
    if (!this.client.connected) {
      await this.client.connect();
    }
    const { rows: rows2 } = await this.client.queryObject<T>(query);
    return rows2;
  }

  async createTransaction<T extends TimetableItem>(t: T): Promise<void> {
    if (!this.client.connected) {
      await this.client.connect();
    }
    const id = nanoid();
    const transaction = this.client.createTransaction(id);
    await transaction.begin();
    await transaction
      .queryArray`$INSERT INTO timetable_items (job_title, position, description, started_at, quit_at, location, tech_stack_id, company) VALUES ("${t.position}", "${t.description}," "${t.started_at}", "${t.quit_at}", "${t.location}", "${t.tech_stack_id}", "${t.company}");`;

    await transaction.commit();
  }
}

export default PgClient;

// const client = new Client({
//   user: "user",
//   database: "dbname",
//   hostname: "127.0.0.1",
//   port: 5432,
//   password: "password",
// });
// await client.connect();
