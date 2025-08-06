import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type
import { join } from "path";

const device = new USB();

const example = async () => {
  device.open(async function (error) {
    if (error) {
      console.error(error);
      return;
    }
    const options = { encoding: "GB18030" /* default */ };
    let printer = new Printer(device, options);

    printer
      .font("a")
      .align("ct")
      .style("bu")
      .size(1, 1)
      .text("EAN13 barcode example")
      .barcode("123456789012", "EAN13", { height: 100, width: 200 })
      .text("123456789012")
      .spacing(4)
      .table(["One", "Two", "Three"]);

    printer = await printer.qrimage("https://github.com/node-escpos/driver");

    printer.close();
  });
};
