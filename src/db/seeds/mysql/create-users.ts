import { Role, SocialType, PrismaClient } from "@prisma/client";
import { createUser } from "../../../domains/users/service/create-user";

/**
 *
 * @info User 4명 생성
 */
export const createUsers = async (prisma: PrismaClient) => {
    const userList = [
        {
            email: "dohan@test.gmail.com",
            name: "dohan",
            socialId: "1"
        },
        {
            email: "test@test.gmail.com",
            name: "test",
            socialId: "2"
        },
        {
            email: "대행@test.gmail.com",
            name: "대행",
            socialId: "3"
        },
        {
            email: "abc@test.gmail.com",
            name: "abc",
            socialId: "4"
        }
    ];

    for (const user of userList) {
        await createUser(
            { user: { email: user.email, name: user.name }, meta: { role: Role.User }, social: { type: SocialType.Kakao, socialId: user.socialId } },
            prisma
        );
    }
};
