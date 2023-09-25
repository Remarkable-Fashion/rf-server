import { PrismaClient } from "@prisma/client";

export async function getMyFollowingPostsService({userId, take, lastCreatedAt}: {userId: number, take: number, lastCreatedAt?: Date}, prisma: PrismaClient) {
    return prisma.$transaction(async tx => {
        // 1. 유저가 팔로잉하는 다른 유저들의 ID를 가져옵니다.
        const followingUsers = await tx.follows.findMany({
            where: {
              followerId: userId,
            },
            select: {
              followingId: true,
            },
          });
        
          const followingUserIds = followingUsers.map(f => f.followingId);

        //   const totalCountsOfPosts = await tx.posts.count({
        //     where: {
        //         userId: {
        //             in: followingUserIds,
        //         }
        //     }
        //   })

          const lastMyFollowingPost = await tx.posts.findFirst({
            select: {
                id: true,
                createdAt: true,
            },
            where: {
                userId: {
                    in: followingUserIds,
                },
            },
            orderBy: {
                createdAt: "asc"
            }
          })
        
          // 2. 팔로잉하는 유저들의 게시글을 최신순으로 가져옵니다.
          const posts = await tx.posts.findMany({
            select: {
              id: true,
              createdAt: true,
              images: {
                  select: {
                      url: true
                  }
              },
              _count: {
                  select: {
                      favorites: true
                  }
              },
              user: {
                  select: {
                      id: true,
                      name: true,
                      profile: {
                          select: {
                              avartar: true
                          }
                      },
                      followers: {
                          select: {
                              followerId: true,
                              followingId: true
                          },
                          where: {
                              followerId: userId
                          }
                      }
                  }
              },
              favorites: {
                  select: {
                      userId: true,
                      postId: true
                  },
                  where: {
                      userId
                  }
              },
              scraps: {
                  select: {
                      userId: true,
                      postId: true
                  },
                  where: {
                      userId
                  }
              }
          },
            where: {
              userId: {
                in: followingUserIds,
              },
              createdAt: {
                lt: lastCreatedAt, // 마지막으로 조회한 게시글의 생성일
              },
              isPublic: true,
              deletedAt: null
            },
            orderBy: {
              createdAt: 'desc',
            },
            // skip: (page - 1) * pageSize,
            take: take,
          });

          const parsedPosts = posts.map((post) => {
            const { user, favorites, scraps, ...restPost } = post;
            const { followers, ...restUser } = user;
            const isFollow = post.user.followers.length > 0;
            const isFavorite = post.favorites.length > 0;
            const isScrap = post.scraps.length > 0;
    
            return {
                isFavorite,
                isFollow,
                isScrap,
                user: restUser,
                ...restPost
            };
        });
        
          return {
            posts: parsedPosts,
            lastMyFollowingPost
        };
    });
}