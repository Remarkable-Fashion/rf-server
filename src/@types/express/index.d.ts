/* eslint-disable @typescript-eslint/no-empty-interface */
import { Roles, Users } from "@prisma/client";

export {};

// export type UserWithRole = Users & {role: Pick<Roles, "role">};
export type UserWithRole = Users & Pick<Roles, "role">;

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface AuthInfo {}
        export interface Request {
            id: number;
        }
        export interface User extends UserWithRole {
        // export interface User extends Users, Pick<Roles, "role"> {
            accessToken?: string;
        }
    }
}
