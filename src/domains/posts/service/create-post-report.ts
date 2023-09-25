// import { Clothes, type PrismaClient } from "@prisma/client";
// import { postSex } from "../types";

// export const createPostReportService = async (
//     prisma: PrismaClient
// ) => {
//     const isClosthes = clothes && clothes.length > 0;

//     return prisma.posts.create({
//         select: {
//             id: true,
//             createdAt: true,
//             images: {
//                 select: {
//                     id: true,
//                     url: true
//                 }
//             },
//             height: true,
//             weight: true,
//             user: {
//                 select: {
//                     id: true,
//                     name: true,
//                     profile: {
//                         select: {
//                             avartar: true
//                         }
//                     }
//                 }
//             },
//             // title: true,
//             description: true,
//             clothes: {
//                 select: {
//                     id: true,
//                     category: true,
//                     brand: true,
//                     name: true,
//                     price: true,
//                     color: true,
//                     size: true,
//                     imageUrl: true
//                     // siteUrl: true
//                 }
//             },
//             tpos: {
//                 select: {
//                     tpoId: true
//                 }
//             },
//             seasons: true,
//             styles: true,
//             isPublic: true,
//             sex: true
//         },
//         data: {
//             userId,
//             ...(height && { height }),
//             ...(weight && { weight }),
//             description,
//             ...(tpos && {
//                 tpos: {
//                     createMany: {
//                         data: tpos.map((tpo) => ({ tpoId: Number(tpo) }))
//                     }
//                 }
//             }),
//             ...(seasons && {
//                 seasons: {
//                     createMany: {
//                         data: seasons.map((season) => ({ seasonId: Number(season) }))
//                     }
//                 }
//             }),
//             ...(styles && {
//                 styles: {
//                     createMany: {
//                         data: styles.map((style) => ({ stylesId: Number(style) }))
//                     }
//                 }
//             }),
//             // ...(seasons && { seasons }),
//             // ...(styles && { styles }),
//             ...(isPublic && { isPublic }),
//             ...(sex && { sex }),
//             images: {
//                 create: imgUrls.map((url) => ({ url }))
//             },
//             ...(isClosthes
//                 ? {
//                       clothes: {
//                           create: clothes.map((e) => ({ ...e }))
//                       }
//                   }
//                 : {})
//         }
//     });
// };
