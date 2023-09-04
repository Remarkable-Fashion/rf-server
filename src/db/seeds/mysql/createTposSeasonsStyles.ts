import { PrismaClient, Tpo, Season, Style } from "@prisma/client";

// const prisma = new PrismaClient();

export const createTposSeasonsStyles = async (prisma: PrismaClient = new PrismaClient()) => {
    const tpoList: { text: Tpo; emoji: string }[] = [
        {
            text: "Occean",
            emoji: "🌊"
        },
        {
            text: "Travel",
            emoji: "✈"
        },
        {
            text: "Date",
            emoji: "🧑‍🤝‍🧑"
        },
        {
            text: "Wedding",
            emoji: "👰"
        },
        {
            text: "Campus",
            emoji: "🎓"
        },
        {
            text: "Work",
            emoji: "⛏"
        },
        {
            text: "Daily",
            emoji: "🚶‍♂️"
        }
        // {
        //     text: "Etc",
        //     emoji: "😴"
        // }
    ];
    const tpos = await prisma.tpos.createMany({
        data: tpoList,
        skipDuplicates: true
    });

    const seasonList: { text: Season; emoji: string }[] = [
        {
            text: "Fall",
            emoji: "🍂"
        },
        {
            text: "Spring",
            emoji: "🌼"
        },
        {
            text: "Summer",
            emoji: "🏖"
        },
        {
            text: "Winter",
            emoji: "⛷"
        }
        // {
        //     text: "Etc",
        //     emoji: "😴"
        // }
    ];

    const seasons = await prisma.seasons.createMany({
        data: seasonList,
        skipDuplicates: true
    });

    const styleList: { text: Style; emoji: string }[] = [
        {
            text: "Classic",
            emoji: "🍔"
        },
        {
            text: "Dandy",
            emoji: "🕶"
        },
        {
            text: "Retro",
            emoji: "🛼"
        },
        {
            text: "Street",
            emoji: "🛣️"
        }
        // {
        //     text: "Etc",
        //     emoji: "😴"
        // }
    ];
    const styles = await prisma.styles.createMany({
        data: styleList,
        skipDuplicates: true
    });

    console.log("tpo :", tpos);
    console.log("style :", styles);
    console.log("season :", seasons);
    console.log("seed createTposSeasonsStyles 완료");
};

if (require.main === module) {
    createTposSeasonsStyles()
        .then
        // async () => {
        //     await prisma.$disconnect();
        //     process.exit(1);
        // }
        ();
}
