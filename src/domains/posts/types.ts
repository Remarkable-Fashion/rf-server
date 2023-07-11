import { ClothesCategory } from "@prisma/client";

export type Clothes = {
    category: ClothesCategory;
    name: string;
    price?: number | null;
    color?: string | null;
    size?: string | null;
    imageUrl?: string | null;
    siteUrl?: string | null;
};

export const POST_PRE_FIX = "post";

export const postSex = ["Male", "Female"] as const;
