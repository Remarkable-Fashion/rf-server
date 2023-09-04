import multer from "multer";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import path from "path";
import { conf } from "../config";
import { BadReqError } from "../lib/http-error";

const { MAX_FILE_SIZE, MAX_FILES, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = conf();

const s3 = new S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});
/**
 *
 *
 */
// export const upload = multer({
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             cb(null, IMAGES_DIR_PATH);
//         },
//         filename: (req, file, cb) => {
//             const ext = path.extname(file.originalname); // 확장자 추출

//             if (!req.id) {
//                 throw new Error("Check your auth");
//             }
//             /**
//              * @format "https://wadada.me/10-d8-1684206706483.png"
//              */
//             const splitedFileName = file.originalname.split(".")[0];
//             const fileName = `${req.id}-${splitedFileName.substring(0, 2)}-${Date.now()}${ext}`;
//             cb(null, fileName);
//         }
//     }),
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
//             return cb(null, true);
//         }

//         return cb(null, false);
//     },
//     limits: {
//         fileSize: MAX_FILE_SIZE, // 600kb
//         files: MAX_FILES
//     }
// });

export const upload = ({ prefix }: { prefix?: string } = {}) =>
    multer({
        storage: multerS3({
            s3,
            bucket: "dev-rc-1",
            acl: "public-read",
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key(req, file, callback) {
                const ext = path.extname(file.originalname); // 확장자 추출

                if (!req.id) {
                    throw new Error("Check your auth");
                }

                const fileNameT = file.originalname.split(".")[0];
                let fileName = `${req.id}-${fileNameT.substring(0, 2)}-${Date.now()}${ext}`;
                if (prefix) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    fileName = `${prefix}-${fileName}`;
                }
                callback(null, fileName);
            }
        }),
        fileFilter: (req, file, cb) => {
            const allowMimeType = ["image/png", "image/jpg", "image/jpeg", "image/*"];
            // if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            if (allowMimeType.includes(file.mimetype)) {
                return cb(null, true);
            }

            return cb(new BadReqError(`You should image/png | image/jpg | image/jpeg, : ${file.mimetype}`));
            // return cb(null, false);
        },
        limits: {
            fileSize: MAX_FILE_SIZE, // 600kb
            files: MAX_FILES
        }
    });
// export const upload = ({ prefix }: { prefix?: string } = {}) =>
//     multer({
//         storage: multer.diskStorage({
//             destination: (req, file, cb) => {
//                 cb(null, IMAGES_DIR_PATH);
//             },
//             filename: (req, file, cb) => {
//                 const ext = path.extname(file.originalname); // 확장자 추출

//                 if (!req.id) {
//                     throw new Error("Check your auth");
//                 }
//                 /**
//                  * @format "https://wadada.me/10-d8-1684206706483.png"
//                  */
//                 const fileNameT = file.originalname.split(".")[0];
//                 let fileName = `${req.id}-${fileNameT.substring(0, 2)}-${Date.now()}${ext}`;
//                 if (prefix) {
//                     fileName = `${prefix}-${fileName}`;
//                 }
//                 cb(null, fileName);
//             }
//         }),
//         fileFilter: (req, file, cb) => {
//             if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
//                 return cb(null, true);
//             }

//             return cb(null, false);
//         },
//         limits: {
//             fileSize: MAX_FILE_SIZE, // 600kb
//             files: MAX_FILES
//         }
//     });
