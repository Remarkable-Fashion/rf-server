// import { Clothes, PrismaClient, Sex } from "@prisma/client";
// import { createPost } from "../../domains/posts/service/create-post";
// import { createCollectionName } from "../../domains/posts/create-collection-name";
// import { createYearMonthString } from "../../lib/create-date";
// import { POST_PRE_FIX } from "../../domains/posts/types";
// import { createPostMongo } from "../../domains/posts/service/create-post-mongo";
// import { Mongo } from "../mongodb";
// import { conf } from "../../config";
// import { createFavorite } from "../../domains/posts/service/create-favorite";
// import { createTposSeasonsStyles } from "./createTposSeasonsStyles";
// import { createScrap } from "../../domains/posts/service/create-scrap";
// import { createFollowingService } from "../../domains/users/service/create-following";

// const prisma = new PrismaClient();
// const mongo = new Mongo(conf().MONGO_URI, conf().MONGO_DB);
// /**
//  * @info user 2개 생성.
//  * post 1개 생성. (mongo에도 생성.)
//  * favorite 1개 생성.
//  */
// async function main() {
//     await mongo.connect();

//     await createTposSeasonsStyles(prisma);

//     const alice = await prisma.users.upsert({
//         where: { email: "alice@prisma.io" },
//         update: {},
//         create: {
//             email: "alice@prisma.io",
//             name: "Alice",
//             profile: {
//                 create: {
//                     sex: "Female",
//                     avartar: "https://dev.rcloset.biz/1-다운-1685674305072.jpg"
//                 }
//             },
//             meta: {
//                 create: {
//                     role: "User"
//                 }
//             }
//         }
//     });
//     const bob = await prisma.users.upsert({
//         where: { email: "bob@prisma.io" },
//         update: {},
//         create: {
//             email: "bob@prisma.io",
//             name: "Bob",
//             profile: {
//                 create: {
//                     sex: "Male"
//                 }
//             },
//             meta: {
//                 create: {
//                     role: "User"
//                 }
//             }
//         }
//     });

//     const dohan = await prisma.users.upsert({
//         where: { email: "dohan@prisma.io" },
//         update: {},
//         create: {
//             email: "dohan@prisma.io",
//             name: "Dohan",
//             profile: {
//                 create: {
//                     sex: "Male"
//                 }
//             },
//             meta: {
//                 create: {
//                     role: "User"
//                 }
//             }
//         }
//     });

//     await createFollowingService({ followerId: alice.id, followingId: bob.id }, prisma);
//     await createFollowingService({ followerId: alice.id, followingId: dohan.id }, prisma);
//     await createFollowingService({ followerId: dohan.id, followingId: alice.id }, prisma);

//     const clothes: Omit<Clothes, "id" | "postId" | "createdAt">[] = [
//         { brand: "NIKE", category: "Top", name: "옷이름", price: 3000, color: "black", size: "L", imageUrl: "image", siteUrl: "site" }
//     ];

//     const postData1 = {
//         userId: alice.id,
//         title: "test title 1",
//         description: "test description 1",
//         imgUrls: ["https://dev.rcloset.biz/1-다운-1685674305072.jpg"],
//         clothes,
//         sex: Sex.Male
//     };

//     const post = await createPost(postData1, prisma);
//     const { id: mysqlId, ..._post } = post;
//     const collectionName = createCollectionName(createYearMonthString(), POST_PRE_FIX);
//     await createPostMongo({ postId: mysqlId, ..._post }, mongo.Db, collectionName);

//     const favorite1 = await createFavorite({ userId: bob.id, postId: post.id }, prisma);
//     const scrap1 = await createScrap({ userId: bob.id, postId: post.id }, prisma);

//     const postData2 = {
//         userId: alice.id,
//         title: "test title 2",
//         description: "test description 1",
//         imgUrls: ["https://dev.rcloset.biz/1-다운-1685674305072.jpg"],
//         clothes,
//         sex: Sex.Male
//     };

//     const post2 = await createPost(postData2, prisma);
//     const { id: mysqlId2, ..._post2 } = post2;
//     const collectionName2 = createCollectionName(createYearMonthString(), POST_PRE_FIX);
//     await createPostMongo({ postId: mysqlId2, ..._post2 }, mongo.Db, collectionName2);

//     const favorite2 = await createFavorite({ userId: bob.id, postId: post2.id }, prisma);
//     const scrap2 = await createScrap({ userId: bob.id, postId: post2.id }, prisma);

//     const postData3 = {
//         userId: dohan.id,
//         title: "test title 3",
//         description: "test description 1",
//         imgUrls: ["https://dev.rcloset.biz/1-다운-1685674305072.jpg"],
//         clothes,
//         sex: Sex.Male
//     };

//     const post3 = await createPost(postData3, prisma);
//     const { id: mysqlId3, ..._post3 } = post3;
//     const collectionName3 = createCollectionName(createYearMonthString(), POST_PRE_FIX);
//     await createPostMongo({ postId: mysqlId3, ..._post3 }, mongo.Db, collectionName3);

//     console.log("Complete Seeding");
// }
// main()
//     .then(async () => {
//         await prisma.$disconnect();
//         process.exit(1);
//     })
//     .catch(async (e) => {
//         console.error(e);
//         await prisma.$disconnect();
//         process.exit(1);
//     });
