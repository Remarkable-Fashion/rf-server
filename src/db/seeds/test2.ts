// import { Clothes, PrismaClient, Sex } from "@prisma/client";
// import { Client } from "@elastic/elasticsearch";
// import { createPost } from "../../domains/posts/service/create-post";

// const prisma = new PrismaClient();
// /**
//  * @info
//  * Post 1개 생성
//  * ELK 생성
//  */
// async function main() {
//     console.log(process.env.NODE_ENV);

//     const client = new Client({
//         // node: "http://dev-elasticsearch:9200",
//         node: "http://localhost:9200",
//         maxRetries: 5,
//         requestTimeout: 60000,
//         sniffOnStart: true
//     });

//     const indexName = "posts";

//     const rv = await client.indices.exists({ index: indexName });

//     if (!rv.body) {
//         console.log("No Index");
//         return;
//     }

//     const clothes: Omit<Clothes, "id" | "postId" | "createdAt">[] = [
//         { brand: "NIKE", category: "Top", name: "옷이름", price: 3000, color: "black", size: "L", imageUrl: "image", siteUrl: "site" }
//     ];

//     const userId = 1;
//     const postData1 = {
//         userId,
//         title: "강원도 양양",
//         description: "양양 여름 풀파티",
//         imgUrls: ["https://dev.rcloset.biz/1-다운-1685674305072.jpg"],
//         clothes,
//         sex: Sex.Female
//     };

//     const post = await createPost(postData1, prisma);
//     const { id: mysqlId, ..._post } = post;

//     /**
//      * @todo
//      * Insert to ELK
//      * _id: post.id
//      */
//     const rv3 = await client.index({
//         index: indexName,
//         id: String(post.id),
//         pipeline: "timestamp",
//         body: {
//             ...post
//         }
//     });

//     console.log("elk :", rv3);

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
