export type WithoutNull<T> = {
    [K in keyof T]?: Exclude<T[K], null>;
};