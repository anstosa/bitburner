import { NS } from "Bitburner";

const CELL_PADDING = 1;

export enum Level {
  LOG = "log",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

const isNumber = (value: unknown): value is number => Number.isInteger(value);

export class Logger {
  ns: NS;

  constructor(ns: NS) {
    this.ns = ns;
  }

  print = (message: string, ...args: string[]): void =>
    this.ns.print([message, ...args].join(", "));

  log = (message: string, ...args: string[]): void =>
    this.print(`LOG   █ ${message}`, ...args);

  info = (message: string, ...args: string[]): void =>
    this.print(`INFO  █ ${message}`, ...args);

  warn = (message: string, ...args: string[]): void =>
    this.print(`WARN  █ ${message}`, ...args);

  error = (message: string, ...args: string[]): void =>
    this.print(`ERROR █ ${message}`, ...args);

  table = (
    table: Array<[Level, ...Array<string | number>]>,
    format: string[] = []
  ): void => {
    const widths: number[] = [];

    // get column widths and format numbers
    table.forEach(([, ...row], rowIndex) => {
      row.forEach((cell, columnIndex) => {
        let content: string;
        if (isNumber(cell)) {
          content = this.ns.nFormat(cell, "($ 0.00 a)");
          table[rowIndex][columnIndex + 1] = content;
        } else {
          content = cell;
        }
        widths[columnIndex] = Math.max(
          widths[columnIndex] ?? 0,
          content.length
        );
      });
    });

    const rowWidth =
      widths.reduce((memo, value) => memo + value, 0) + // all cells
      widths.length * (1 + CELL_PADDING * 2) + // cell padding and dividers
      1; // extra border

    const padding = new Array(CELL_PADDING + 1).join(" ");

    // top border
    this.log(new Array(rowWidth + 1).join("="));

    // print rows
    table.forEach(([level, ...row], rowIndex) => {
      const cells: string[] = [];
      row.forEach((cell, columnIndex) => {
        cells.push(
          this.ns.sprintf(
            `%${format[columnIndex]}${widths[columnIndex]}s`,
            String(cell)
          )
        );
      });
      const result = `|${padding}${cells.join(
        `${padding}|${padding}`
      )}${padding}|`;
      if (level === Level.ERROR) {
        this.error(result);
      } else if (level === Level.WARN) {
        this.warn(result);
      } else if (level === Level.INFO) {
        this.info(result);
      } else {
        this.log(result);
      }
      // header divider
      if (rowIndex === 0) {
        this.log(new Array(rowWidth + 1).join("="));
      }
    });

    this.log(new Array(rowWidth + 1).join("—"));
  };
}

export class TerminalLogger extends Logger {
  print = (message: string): void => this.ns.tprint(message);
}

export const main = (ns: NS): void => {
  const logger = new TerminalLogger(ns);
  logger.log("This is a basic log");
  logger.info("This is an info log");
  logger.warn("This is a warning log");
  logger.error("This is an error log");
  logger.table(
    [
      [Level.LOG, "hostname", "status", "value"],
      [Level.LOG, "server01", "😊 delighted", 123456789],
      [Level.ERROR, "server02", "☹️ sad", 67],
    ],
    ["-", "-", ""]
  );
};
