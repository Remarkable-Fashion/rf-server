export type ExcludeNull<T> = {
    [K in keyof T]: Exclude<T[K], null>;
};

export type ExcludeNullAndPartial<T> = Partial<ExcludeNull<T>>
