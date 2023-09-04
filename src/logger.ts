import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment-timezone";
import { conf } from "./config";

function getRequestLogFormatter() {
    const { combine, timestamp, printf } = winston.format;

    return combine(
        timestamp({ format: () => moment().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ss") }),
        // timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
        printf((info) => {
            const { req, res } = info.message;
            // const ip = req.headers["X-Real-IP"] || req.connection.remoteAddress;
            const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            return `${info.timestamp} ${info.level}: ${ip}${req.port || ""} ${res.statusCode} ${req.method} '${req.originalUrl}'`;
            // return `${info.timestamp} ${info.level}: ${req.hostname}${req.port || ""} ${req.method} '${req.originalUrl}'`;
        })
    );
}

const transportsInfo = new DailyRotateFile({
    level: "info",
    filename: `${conf().LOG_DIR}/%DATE%.log`,
    // filename: 'application-%DATE%.log',
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
});

const transportsError = new DailyRotateFile({
    level: "error",
    filename: `${conf().LOG_DIR}/%DATE%.error.log`,
    // filename: 'application-%DATE%.log',
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d"
});

const logger = winston.createLogger({
    // level: "info",
    format: getRequestLogFormatter(),
    // format: winston.format.json(),
    // defaultMeta: { service: "user-service" },
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        // new winston.transports.File({ filename: `${conf().LOG_DIR}/error.log`, level: "error" }),
        // new winston.transports.File({ filename: `${conf().LOG_DIR}/combined.log` })
        transportsInfo,
        transportsError
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: getRequestLogFormatter()
        })
    );
}

export { logger };
