import { Client } from "@elastic/elasticsearch";
import { createPostElasticSearchService } from "../../../../domains/posts/service/create-post-elasticsearch";
import { createClothesElasticSearchService } from "../../../../domains/clothes/service/create-es-clothes";
import { CLOTHES_INDEX, POSTS_INDEX } from "../../../../domains/search/constants";
import { getPostsAllService } from "../../../../domains/posts/service/get-posts-all";
import Prisma from "../../../prisma";

const insertIndexPostAndClothes = async (client: Client) => {
    const posts = await getPostsAllService(Prisma);

    await Promise.all(
        posts.map(async (post) => {
            await createPostElasticSearchService({ index: POSTS_INDEX, id: String(post.id), data: post }, client);

            if (post.clothes.length) {
                await createClothesElasticSearchService({ index: CLOTHES_INDEX, clothes: post.clothes }, client);
            }
        })
    );
};

if (require.main === module) {
    const client = new Client({
        // node: conf().ELK_DB,
        // node: "http://dev-elasticsearch:9200",
        node: "http://localhost:9200",
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: true
    });

    console.log("start Inserting");
    insertIndexPostAndClothes(client).then(() => {
        console.log("end Inserting");
    });
}