import { Client } from "@opensearch-project/opensearch";
import Prisma from "../prisma";
import { createUsers } from "./mysql/create-users";
import { seedElasticsearch } from "./elasticsearch";
import { createPosts } from "./mysql/create-posts";

const main = async () => {
    const client = new Client({
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    try {
        await seedElasticsearch(client);
        await createUsers(Prisma);
        await createPosts(Prisma, client);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
        await Prisma.$disconnect();
    }
};

if (require.main === module) {
    main();
}
