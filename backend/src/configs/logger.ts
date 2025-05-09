import { addColors, createLogger, format, transports } from "winston";

const uppercaseFormat = format((info) => {
  info.originalLevel = info.level;
  info.level = info.level.toUpperCase();
  return info;
});

const customFormat = format.printf(({ timestamp, level, message }) => {
  const timeOnly = (timestamp as string).split(" ")[1];
  return `${timeOnly} [${level}] ${message}`;
});

const colors = {
  info: "blue",
  warn: "yellow",
  error: "red",
  http: "cyan",
  debug: "gray",
};

addColors(colors);
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.splat(),
    format.json(),
  ),

  transports: [
    new transports.Console({
      format: format.combine(uppercaseFormat(), format.colorize(), customFormat),
    }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

export { logger };