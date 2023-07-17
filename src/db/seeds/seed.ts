import {client} from "../elasticsearch";
import { seedElasticsearch } from "./elasticsearch";

const main = async () => {
    try {
        await seedElasticsearch(client);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

if(require.main === module){
    main();
}