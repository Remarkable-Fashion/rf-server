export type ExcludeNull<T> = {
    [K in keyof T]: Exclude<T[K], null>;
};

export type ExcludeNullAndPartial<T> = Partial<ExcludeNull<T>>;

export type NotNull<T> = {
    [K in keyof T]: NonNullable<T[K]>;
};

export type Unarray<T> = T extends Array<infer U> ? U : T;
