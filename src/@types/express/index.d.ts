/* eslint-disable @typescript-eslint/no-empty-interface */
import { Profile, Role, SocialType, Users } from "@prisma/client";

export {};

type RoleList = keyof typeof Role;
export type UserWithRole = Omit<Users, "createdAt" | "deletedAt" | "updatedAt" | "phoneNumber" | "phoneVerified"> & { role: RoleList } & { type: SocialType; profile: Profile };

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface AuthInfo {}
        export interface Request {
            id: number;
            kakaoToken?: string;
        }
        export interface User extends UserWithRole {
            // export interface User extends Users, Pick<Roles, "role"> {
            accessToken?: string;
        }
    }
}
