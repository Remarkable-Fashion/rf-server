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
