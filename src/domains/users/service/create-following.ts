import { PrismaClient } from "@prisma/client"

export const createFollowingService = async (data: { followerId: number, followingId: number} ,prisma: PrismaClient) => {
    // return prisma.follows.upsert({
    //     create: {
    //         followerId: data.followerId,
    //         followingId: data.followingId
    //     },
    //     update: {},
    //     where: {
    //         followerId_followingId: {
    //             followerId: data.followerId,
    //             followingId: data.followingId
    //         }
    //     }
    // })
    // const follows = await prisma.follows.findUnique({
    //     where: {
    //         followerId_followingId: {
    //             followerId: data.followerId,
    //             followingId: data.followingId
    //         }
    //     }
    // })

    // if(follows){
    //     console.log("이미있음");
    //     return follows;
    // }
    return prisma.follows.create({
        data: {
            followerId: data.followerId,
            followingId: data.followingId
        }
    })
}