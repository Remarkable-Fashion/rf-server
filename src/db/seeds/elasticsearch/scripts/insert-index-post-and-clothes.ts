import { EsClient } from "../../../elasticsearch";
import { createPostElasticSearchService } from "../../../../domains/posts/service/create-post-elasticsearch";
import { createClothesElasticSearchService } from "../../../../domains/clothes/service/create-es-clothes";
import { CLOTHES_INDEX, POSTS_INDEX } from "../../../../domains/search/constants";
import { getPostsAllService } from "../../../../domains/posts/service/get-posts-all";
import Prisma from "../../../prisma";

const insertIndexPostAndClothes = async (client: EsClient) => {
    const posts = await getPostsAllService(Prisma);

    const recommendClothes = await Prisma.clothes.findMany({
        where: {
            recommendedClothesId: {
                not: null
            }
        }
    });

    if (recommendClothes.length > 0) {
        await createClothesElasticSearchService({ index: CLOTHES_INDEX, clothes: recommendClothes }, client);
    }

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
    import("../../../elasticsearch").then(({ client }) => {
        console.log("start Inserting");
        insertIndexPostAndClothes(client).then(() => {
            console.log("end Inserting");
        });
    });
}
