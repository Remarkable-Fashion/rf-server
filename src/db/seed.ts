import { Clothes, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
    const alice = await prisma.users.upsert({
        where: { email: "alice@prisma.io" },
        update: {},
        create: {
            email: "alice@prisma.io",
            name: "Alice"
        }
    });
    const bob = await prisma.users.upsert({
        where: { email: "bob@prisma.io" },
        update: {},
        create: {
            email: "bob@prisma.io",
            name: "Bob"
        }
    });
    console.log({ alice, bob });

    const clothes: Omit<Clothes, "id" | "postId">[] = [
        { category: "Top", name: "옷이름", price: 3000, color: "black", size: "L", imageUrl: "image", siteUrl: "site" }
    ];
    const post = await prisma.posts.create({
        select: {
            userId: true,
            title: true,
            description: true,
            images: true,
            clothes: true
        },
        data: {
            userId: alice.id,
            title: "제목",
            description: "내용",
            images: {
                create: [{ url: "image_url_test" }]
            },
            ...(clothes &&
                clothes.length > 0 && {
                    clothes: {
                        create: clothes.map((e) => ({ ...e }))
                    }
                })
        }
    });
    console.log("post :", post);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
