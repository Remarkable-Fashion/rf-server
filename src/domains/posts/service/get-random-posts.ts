import { PrismaClient } from "@prisma/client";
import { Order } from "../../search/service/get-search-posts";

export const getPostsByIdsService = async ({ userId, postIds, order }: { userId: number; postIds: number[], order?: Order }, prisma: PrismaClient) => {

    const orderBy: Record<string, any> = [];

    if(order === "recent"){
        orderBy.push({
            createdAt: "desc"
        });
    } else if (order === "best"){
        orderBy.push({
            likeCount: "desc"
        });
        orderBy.push({
            createdAt: "desc"
        });
    } else {
        orderBy.push({
            createdAt: "desc"
        });
    }

    

    const posts = await prisma.posts.findMany({
        select: {
            id: true,
            createdAt: true,
            images: {
                select: {
                    url: true
                }
            },
            likeCount: true,
            // _count: {
            //     select: {
            //         favorites: true
            //     }
            // },
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
            },
            styles: {
                select: {
                    stylesId: true,
                    styles: {
                        select: {
                            text: true,
                            emoji: true
                        }
                    }
                }
            },
            tpos: {
                select: {
                    tpoId: true,
                    tpo: {
                        select: {
                            text: true,
                            emoji: true
                        }
                    }
                }
            },
            seasons: {
                select: {
                    seasonId: true,
                    season: {
                        select: {
                            text: true,
                            emoji: true
                        }
                    }
                }
            }
        },
        where: {
            id: {
                in: postIds
            },
            // isPublic: true,
            // deletedAt: null
        },
        orderBy: orderBy
    });

    const parsedPosts = posts.map((post) => {
        const { user, favorites, scraps, likeCount, styles, seasons, tpos, ...restPost } = post;
        const { followers, ...restUser } = user;
        const isFollow = post.user.followers.length > 0;
        const isFavorite = post.favorites.length > 0;
        const isScrap = post.scraps.length > 0;
        const parsedStyles = styles.map((style) => {
            return {
                id: style.stylesId,
                text: style.styles.text,
                emoji: style.styles.emoji
            };
        });
        const parsedTpos = tpos.map((tpo) => {
            return {
                id: tpo.tpoId,
                text: tpo.tpo.text,
                emoji: tpo.tpo.emoji
            };
        });
        const parsedSeasons = seasons.map((season) => {
            return {
                id: season.seasonId,
                text: season.season.text,
                emoji: season.season.emoji
            };
        });

        return {
            isFavorite,
            isFollow,
            isScrap,
            user: restUser,
            _count: {
                favorites: likeCount
            },
            styles: parsedStyles,
            tpos: parsedTpos,
            seasons: parsedSeasons,
            ...restPost
        };
    });

    return parsedPosts;
    // return prisma.$transaction([posts]);
};
