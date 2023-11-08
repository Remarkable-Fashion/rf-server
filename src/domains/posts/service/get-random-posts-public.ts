import { PrismaClient } from "@prisma/client";
import { getPostsByIdsService } from "./get-random-posts";

export const getRandomPostsPublicService = async (
    { postIds }: { postIds: number[] },
    prisma: PrismaClient
): ReturnType<typeof getPostsByIdsService> => {
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
            user: {
                select: {
                    id: true,
                    name: true,
                    profile: {
                        select: {
                            avartar: true
                        }
                    }
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
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const parsedPosts = posts.map((post) => {
        const { user, likeCount, styles, seasons, tpos, ...restPost } = post;
        const isFollow = false;
        const isFavorite = false;
        const isScrap = false;
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
            user,
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
};
