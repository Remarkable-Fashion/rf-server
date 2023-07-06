import { PrismaClient } from "@prisma/client";
import { Mongo } from "../mongodb";
import { conf } from "../../config";
import { getUserWithProfileById } from "../../domains/users/service/get-user-with-profile-by-id";
import { getMyPostsService } from "../../domains/posts/service/get-my-posts";
import { createFollowingService } from "../../domains/users/service/create-following";


const prisma = new PrismaClient();
const mongo = new Mongo(conf().MONGO_URI, conf().MONGO_DB);
/**
 * @info user 2개 생성.
 * post 1개 생성. (mongo에도 생성.)
 * favorite 1개 생성.
 */
async function main() {
    await mongo.connect();

    const posts = await prisma.posts.findMany({
        select: {
            id: true,
            user: {
                select: {
                    id: true,
                    profile: {
                        select: {
                            avartar: true
                        }
                    },
                    followers: {
                        where:{
                            followerId: 3
                        }
                    },
                    // following: true,
                }
            }
        }
    });    
    console.log("posts :", posts[0].user.followers);
    // console.log("posts :", posts[0].user.following);

    const userWithProfile = await getUserWithProfileById({id : 1}, prisma);
    console.log("userWithProfile :", userWithProfile);

    const [_, __, postss] = await getMyPostsService({userId: 1, take: 1}, prisma);
    console.log("postss :", postss);
    console.log("postss :", postss.at(-1));
    const postss2 = await getMyPostsService({userId: 1, take: 1, cursor: postss.at(-1)?.id}, prisma);
    console.log("postss2 :", postss2);

    await createFollowingService({followerId: 2, followingId: 1}, prisma);
}
main()
    .then(async () => {
        await prisma.$disconnect();
        process.exit(1);
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
