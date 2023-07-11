import { PrismaClient } from "@prisma/client";
import { isProd } from "../config";

const Prisma = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query"
        }
    ]
});

if (!isProd) {
    Prisma.$on("query", (e) => {
        console.log("Query: ", e.query);
        console.log("Duration: ", `${e.duration}ms`);
    });
}

export default Prisma;
