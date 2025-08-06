import "dotenv/config";
import { Printer, Image } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";
import { Pool } from "pg";

const device = new USB();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const main = async () => {
  const client = await pool.connect();
  const res = await client.query(
    "SELECT * FROM to_print WHERE printed = false"
  );
  console.log(res.rows);
  client.release();

  if (res.rows.length === 0) {
    console.log("No tasks to print");
    process.exit(0);
  }

  for await (const row of res.rows) {
    device.open(async function (error) {
      if (error) {
        console.error(error);
        return;
      }
      const options = { encoding: "GB18030" /* default */ };
      let printer = new Printer(device, options);

      printer
        .font("a")
        .size(2, 2)
        .align("ct")
        .style("B")
        .text(row.priority)
        .style("NORMAL")
        .size(1, 1)
        .text("--------------------------------")
        .align("lt")
        .text("description:")
        .align("ct")
        .text(row.description)
        .newLine(4);

      printer.cut().close();

      await client.query("UPDATE to_print SET printed = true WHERE id = $1", [
        row.id,
      ]);
    });
  }

  client.release();
};

main();
