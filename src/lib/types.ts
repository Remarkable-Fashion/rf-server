// Null 제거하고 옵셔널.
export type WithoutNull<T> = {
    [K in keyof T]?: Exclude<T[K], null>;
};