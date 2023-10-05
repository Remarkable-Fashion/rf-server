import { PrismaClient, Tpos } from "@prisma/client";
import { postSex } from "../types";
import { BadReqError } from "../../../lib/http-error";

export type UpdatePostBody = {
    imgUrls?: string[];
    description?: string;
    isPublic?: boolean;
    sex?: typeof postSex[number];
    height?: number;
    weight?: number;
    tpos?: number[];
    seasons?: number[];
    styles?: number[];
};
// tpos?: string[];
// seasons?: string[];
// styles?: string[];

function arraysAreEqual(arr1: number[], arr2: number[]) {
    // 먼저 배열의 길이를 체크합니다.
    if (arr1.length !== arr2.length) {
      return false;
    }
  
    // 배열의 요소들을 정렬하여 순서에 상관없이 동일한지 체크합니다.
    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();
  
    for (let i = 0; i < sortedArr1.length; i++) {
      if (sortedArr1[i] !== sortedArr2[i]) {
        return false;
      }
    }
  
    return true;
}
function compareArrays(original: number[], newArr: number[]) {
    // 겹치는 것 찾기 (Intersection)
    const intersected = original.filter(value => newArr.includes(value));
  
    // 기존에서 사라진 것 찾기 (Difference)
    const removed = original.filter(value => !newArr.includes(value));
  
    // 새로 생긴 것 찾기
    const added = newArr.filter(value => !original.includes(value));
  
    return {
      intersected,
      removed,
      added
    };
}

export const updatePostByIdService = ({ postId, data }: { postId: number, data: UpdatePostBody }, prisma: PrismaClient) => {

    const {tpos, seasons, styles, ...rest} = data;
    return prisma.$transaction(async (tx) => {
        const post = await tx.posts.findFirst({
            where: {
                id: postId,
                deletedAt: null
            }
        });

        if(!post){
            throw new BadReqError("이미 삭제된 post");
        }

        if(tpos){
            const postTpos = await tx.postTpos.findMany({
                select: {
                    tpoId: true
                },
                where: {
                    postsId: postId
                }
            });

            const tpoIds = postTpos.map( ({tpoId}) => tpoId);

            if(!arraysAreEqual(tpos, tpoIds)){
                const {removed, added} = compareArrays(tpoIds, tpos);
                await tx.postTpos.deleteMany({
                    where: {
                        postsId: postId,
                        tpoId: {
                            in: removed
                        }
                    }
                });
                await tx.postTpos.createMany({
                    data: added.map((tpoId) => ({
                        postsId: postId,
                        tpoId
                    }))
                })
            }
        }

        if(seasons){
            const postSeasons = await tx.postSeasons.findMany({
                select: {
                    seasonId: true
                },
                where: {
                    postsId: postId
                }
            });

            // olds
            const seasonsIds = postSeasons.map( ({seasonId}) => seasonId);

            if(!arraysAreEqual(seasons, seasonsIds)){
                const {removed, added} = compareArrays(seasonsIds, seasons);
                await tx.postSeasons.deleteMany({
                    where: {
                        postsId: postId,
                        seasonId: {
                            in: removed
                        }
                    }
                });
                await tx.postSeasons.createMany({
                    data: added.map((seasonId) => ({
                        postsId: postId,
                        seasonId
                    }))
                })
            }
        }

        if(styles){
            const postStyles = await tx.postStyles.findMany({
                select: {
                    stylesId: true
                },
                where: {
                    postsId: postId
                }
            });

            const StylesIds = postStyles.map( ({stylesId}) => stylesId);

            if(!arraysAreEqual(styles, StylesIds)){
                const {removed, added} = compareArrays(StylesIds, styles);
                await tx.postStyles.deleteMany({
                    where: {
                        postsId: postId,
                        stylesId: {
                            in: removed
                        }
                    }
                });
                await tx.postStyles.createMany({
                    data: added.map((stylesId) => ({
                        postsId: postId,
                        stylesId
                    }))
                })
            }
        }
        

        return await tx.posts.update({
            data: rest,
            where: {
                id: postId,
            }
        });
    });
};
