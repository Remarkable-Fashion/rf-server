// custom.d.ts or typings.d.ts (or any other file with .d.ts extension)

declare namespace Express {
    namespace Multer {
        interface File {
            location: string; // 추가하고자 하는 프로퍼티 이름과 타입
            key: string; // 추가하고자 하는 프로퍼티 이름과 타입
        }
    }
}
