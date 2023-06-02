import { Clothes, PrismaClient, Sex } from "@prisma/client";
import { createPost } from "../../domains/posts/service/create-post";
import { createCollectionName } from "../../domains/posts/create-collection-name";
import { createYearMonthString } from "../../lib/create-date";
import { POST_PRE_FIX } from "../../domains/posts/types";
import { createPostMongo } from "../../domains/posts/service/create-post-mongo";
import { Mongo } from "../mongodb";
import { conf } from "../../config";
import { createFavorite } from "../../domains/posts/service/create-favorite";
import { createTposSeasonsStyles } from "./createTposSeasonsStyles";

const prisma = new PrismaClient();
const mongo = new Mongo(conf().MONGO_URI, conf().MONGO_DB);
/**
 * @info user 2개 생성.
 * post 1개 생성. (mongo에도 생성.)
 * favorite 1개 생성.
 */
async function main() {
    await mongo.connect();

    await createTposSeasonsStyles(prisma)

    const alice = await prisma.users.upsert({
        where: { email: "alice@prisma.io" },
        update: {},
        create: {
            email: "alice@prisma.io",
            name: "Alice",
            profile: {
                create: {
                    sex: "Female",
                    avartar: "https://dev.rcloset.biz/1-다운-1685674305072.jpg"
                }
            },
            meta: {
                create: {
                    role: "User"
                }
            }
        }
    });
    const bob = await prisma.users.upsert({
        where: { email: "bob@prisma.io" },
        update: {},
        create: {
            email: "bob@prisma.io",
            name: "Bob",
            profile: {
                create: {
                    sex: "Male"
                }
            },
            meta: {
                create: {
                    role: "User"
                }
            }
        }
    });
    console.log({ alice, bob });

    const clothes: Omit<Clothes, "id" | "postId">[] = [
        { category: "Top", name: "옷이름", price: 3000, color: "black", size: "L", imageUrl: "image", siteUrl: "site" }
    ];
    
    const data = {
        userId: alice.id,
        title: "test title 1",
        description: "test description 1",
        imgUrls: ["https://dev.rcloset.biz/1-다운-1685674305072.jpg"],
        clothes,
        sex: Sex.Male

    }

    const post = await createPost(data, prisma);
    console.log("post :", post);

    const { id: mysqlId, ..._post } = post;

    const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);

    await createPostMongo({ mysqlId, ..._post }, mongo.Db, collectionName);

    const favorite = await createFavorite({userId: bob.id, postId: post.id}, prisma);

    console.log("favorite :", favorite);
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
