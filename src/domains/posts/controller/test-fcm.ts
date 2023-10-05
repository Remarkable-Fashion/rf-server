import type { Request, Response } from "express";
import admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";
// import firebaseJSON from "../../../../test.json";


export const testFcm = async (req: Request, res: Response) => {
    
    const body = req.body;
    // console.log("admin.credential.applicationDefault() :", admin.credential.applicationDefault());
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
        // credential: admin.credential.cert(firebaseJSON)
    });

    const msg: Message = {
        notification: {
            title: "test title",
            body: "this is test body"
        },
        token: body.token
    }

    const resp = await admin.messaging().send(msg);

    
    // await createScrapService(data, Prisma);

    res.status(200).json({
        success: true,
        msg: "Success test fcm"
    });
    // res.status(200).json(scrap);
};
