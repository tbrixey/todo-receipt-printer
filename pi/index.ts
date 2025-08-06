import "dotenv/config";
import { Printer, Image } from "@node-escpos/core";
import USB from "@node-escpos/usb-adapter";
import { Pool } from "pg";

const device = new USB();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const divider = "--------------------------------";

const main = async () => {
  const client = await pool.connect();
  const res = await client.query(
    "SELECT * FROM to_print WHERE printed = false"
  );
  console.log(res.rows);

  if (res.rows.length === 0) {
    console.log("No tasks to print");
    pool.end();
    process.exit(0);
  }

  for await (const row of res.rows) {
    await new Promise<void>((resolve, reject) => {
      device.open(async function (error) {
        if (error) {
          console.error(error);
          return reject(error);
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
          .text(divider)
          .align("lt")
          .text("description:")
          .align("ct")
          .text(row.description)
          .text(divider);

        if (row.url && row.url !== "") {
          await printer.qrimage(row.url);
        }

        printer.newLine(4);

        printer.cut().close();

        await client.query("UPDATE to_print SET printed = true WHERE id = $1", [
          row.id,
        ]);
        resolve();
      });
    });
  }

  pool.end();
  process.exit(0);
};

main();
