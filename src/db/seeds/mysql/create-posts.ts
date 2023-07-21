import { PrismaClient } from "@prisma/client";
import { CreatePost, _Clothes, createPost } from "../../../domains/posts/service/create-post";
import { conf } from "../../../config";
import {createPostElasticSearchService} from "../../../domains/posts/service/create-post-elasticsearch";
import { CLOTHES_INDEX, POSTS_INDEX } from "../../../domains/search/constants";
import { createClothesElasticSearchService } from "../../../domains/clothes/service/create-es-clothes";
import { Client } from "@elastic/elasticsearch";

/**
 * 
 * @info seed create-users 참고.
 * 유저 3명이 각각 post 10개씩 생성. (clothes 포함)
 */
export const createPosts = async (prisma: PrismaClient, client: Client) => {

    const userList = [1,2,3];
    for(const user of userList){

        for(let i = 0; i < 10; i++){
            const img = `${conf().SERVER_DOMAIN}/${i}.jpg`;

            const topClothes: _Clothes = {
                category: "Top",
                name: `top-${user}-${i}`,
                price: 100,
                brand: null,
                color: null,
                size: null,
                imageUrl: null,
                siteUrl: null,
                reason: null,
                recommendedClothesId: null
            };

            const bottomClothes: _Clothes = {
                category: "Bottom",
                name: `bottom-${user}-${i}`,
                price: 100,
                brand: null,
                color: null,
                size: null,
                imageUrl: null,
                siteUrl: null,
                reason: null,
                recommendedClothesId: null
            };

            const data: CreatePost = {
                userId: user,
                title: `여름-${i}`,
                description: `여름 테스트 ${i}`,
                imgUrls: [img],
                tpos: [1, 2],
                seasons: [1, 2],
                styles: [1, 2],
                isPublic: true,
                sex: "Male",
                clothes: [topClothes, bottomClothes]
            };
    
            const post = await createPost(data, prisma);

            await createPostElasticSearchService({ index: POSTS_INDEX, id: String(post.id), data: post }, client);

            if(post.clothes.length > 0){
                await createClothesElasticSearchService({index: CLOTHES_INDEX, clothes: post.clothes}, client);
            }
        }
    }
};