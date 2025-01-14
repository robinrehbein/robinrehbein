import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import PgClient from "../../lib/pg.ts";
import { TimetableItem } from "../../lib/types.ts";
import Login from "./(_components)/Login.tsx";

interface Data {
  isAllowed: boolean;
  items?: Array<TimetableItem>;
}
const validateSession = (headers: Headers): boolean => {
  const cookies = getCookies(headers);
  return cookies.session === "bar";
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const isAllowed = validateSession(req.headers);
    if (!isAllowed) {
      return ctx.render({ isAllowed });
    }
    const pgClient = new PgClient();
    const items = await pgClient.queryObject<Array<TimetableItem>>(
      "SELECT * FROM timetable_items",
    );
    return ctx.render({ items: items, isAllowed });
  },
  async POST(req, ctx) {
    const isAllowed = validateSession(req.headers);
    if (!isAllowed) {
      return ctx.render({ isAllowed });
    }
    const form = await req.formData();
    const position = form.get("position")?.toString() || "";
    const description = form.get("description")?.toString() || "";
    const started_at = new Date(form.get("started_at")?.toString() || "");
    const quit_at = new Date(form.get("quit_at")?.toString() || "");
    const location = form.get("location")?.toString() || "";
    const tech_stack_id = Number(form.get("tech_stack_id")) || 1;
    const company = form.get("company")?.toString() || "";
    const job_title = form.get("job_title")?.toString() || "";

    // Insert new item into database.
    const client = new PgClient();
    await client.createTransaction(
      {
        position: position,
        description: description,
        started_at: started_at,
        job_title: job_title,
        quit_at: quit_at,
        location: location,
        tech_stack_id: tech_stack_id,
        company: company,
      },
    );

    // Add email to list.

    // Redirect user to thank you page.
    // const headers = new Headers();
    // headers.set("location", "/thanks-for-subscribing");
    // return new Response(null, {
    //   status: 303, // See Other
    //   headers,
    // });
    const pgClient = new PgClient();
    const items = await pgClient.queryObject<Array<TimetableItem>>(
      "SELECT * FROM timetable_items",
    );
    return ctx.render({ items: items, isAllowed });
  },
};

const Admin = ({ data }: PageProps<Data>) => {
  if (!data.isAllowed) {
    return (
      <>
        <div>You are not logged in.</div>
        <Login />
      </>
    );
  }
  return (
    <>
      <div>
        <ul>
          {data.items?.map((item) => <li>{item.job_title}</li>)}
          <li>
            <form method={"post"}>
              <label htmlFor="position">Position</label>
              <input type="text" />
              <label htmlFor="description">Description</label>
              <input type="text" />
              <label htmlFor="started_at">Started at</label>
              <input type="text" />
              <label htmlFor="quit_at">Quit at</label>
              <input type="text" />
              <label htmlFor="job_title">Job Title</label>
              <input type="text" />
              <label htmlFor="location">Location</label>
              <input type="text" />
              <label htmlFor="tech_stack_id">Tech stack id</label>
              <input type="text" />
              <label htmlFor="company">Company</label>
              <input type="text" />
              <button type="submit">Save</button>
            </form>
          </li>
        </ul>
        <a href="/api/logout">Logout</a>
      </div>
    </>
  );
};

export default Admin;
