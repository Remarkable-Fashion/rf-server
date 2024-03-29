import { PrismaClient } from "@prisma/client";
import { EsClient } from "../../elasticsearch";
import { CreatePost, _Clothes, createPost } from "../../../domains/posts/service/create-post";
import { conf } from "../../../config";
import { createPostElasticSearchService } from "../../../domains/posts/service/create-post-elasticsearch";
import { CLOTHES_INDEX, POSTS_INDEX } from "../../../domains/search/constants";
import { createClothesElasticSearchService } from "../../../domains/clothes/service/create-es-clothes";

/**
 *
 * @info seed create-users 참고.
 * 유저 3명이 각각 post 10개씩 생성. (clothes 포함)
 */
export const createPosts = async (prisma: PrismaClient, client: EsClient) => {
    const userList = [1, 2, 3];
    for (const user of userList) {
        const range = Array.from({ length: 10 }, (_, index) => index);

        const resultArray = range.map(async (i) => {
            const img = `${conf().S3_BUCKET_URL}/${i}.jpg`;

            const topClothes: _Clothes = {
                category: "Top",
                name: `top-${user}-${i}`,
                price: 100,
                // likeCount: 0
            };

            const bottomClothes: _Clothes = {
                category: "Bottom",
                name: `bottom-${user}-${i}`,
                price: 100,
                // likeCount: 0
            };

            const data: CreatePost = {
                userId: user,
                // title: `여름-${i}`,
                description: `여름 테스트 ${i}`,
                imgUrls: [img],
                tpos: [1, 2],
                // tpos: ["Occean", "Work"],
                seasons: [1, 2],
                styles: [1, 2],
                isPublic: true,
                sex: "Male",
                clothes: [topClothes, bottomClothes]
            };

            const post = await createPost(data, prisma);

            /**
             * @INFO AWS DMS (cdc) 동기화 사용으로 직접 insert 불필요.
             */
            // await createPostElasticSearchService({ index: POSTS_INDEX, id: String(post.id), data: post }, client);

            // if (post.clothes.length > 0) {
            //     await createClothesElasticSearchService({ index: CLOTHES_INDEX, clothes: post.clothes }, client);
            // }
        });

        await Promise.all(resultArray);
    }
};
