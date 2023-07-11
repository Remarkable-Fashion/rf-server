import { Db } from "mongodb";
import { postSex } from "../types";
// import { Sex } from "@prisma/client"

type Options = {
    size: number;
    sex?: (typeof postSex)[number];
    /**
     * @TODO Profile의 Sex와 Post의 Sex 타입 불일치. 합칠까?
     */
    // sex?: Sex
};

export const getRandomPostsMongo = (db: Db, collectionName: string, options: Options) => {
    const { size, sex } = options;

    const pipeLine = [];
    if (sex) {
        const matchOption = {
            $match: {
                sex
            }
        };
        pipeLine.push(matchOption);
    }

    pipeLine.push({
        $sample: {
            size
        }
    });

    return (
        db
            .collection(collectionName)
            .aggregate(pipeLine)
            // .aggregate([
            //     {
            //         $match: {
            //             status: ""
            //         }
            //     },
            //     {
            //         $sample: {
            //             size
            //         }
            //     }
            // ])
            .toArray()
    );
};
