import admin from "firebase-admin";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

const main = async () => {
    console.log("admin.credential.applicationDefault() :", admin.credential.applicationDefault());
    admin.initializeApp({
        credential: admin.credential.applicationDefault()
        // credential: admin.credential.cert(firebaseJSON)
    });

    const msg: Message = {
        notification: {
            title: "test title",
            body: "this is test body"
        },
        // token: "body.token"
        topic: "all"
    }

    const resp = await admin.messaging().send(msg);
};


main();