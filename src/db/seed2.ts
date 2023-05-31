import { Clothes, PrismaClient, Tpo, Season, Style } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    const tpoList = Array.from<Tpo>(["Occean", "Travel", "Date", "Wedding", "Campus", "Work", "Daily", "Etc"]);
    const tpoData = tpoList.map((tpo) => ({ tpo }));
    const tpos = await prisma.tpos.createMany({
        data: tpoData,
        skipDuplicates: true
    });

    const seasonList = Array.from<Season>(["Spring", "Summer", "Fall", "Winter", "Etc"]);
    const seasonData = seasonList.map((season) => ({ season }));

    const seasons = await prisma.seasons.createMany({
        data: seasonData,
        skipDuplicates: true
    });

    const styleList = Array.from<Style>(["Classic", "Dandy", "Street", "Retro", "Etc"]);
    const styleData = styleList.map((style) => ({ style }));
    const styles = await prisma.styles.createMany({
        data: styleData,
        skipDuplicates: true
    });

    console.log("tpo :", tpos);
    console.log("style :", styles);
    console.log("season :", seasons);
    console.log("seed2 완료");

    await prisma.$disconnect();
    process.exit(1);
};

if (require.main === module) {
    main();
}
