import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const port = `${process.env.PORT}` || 5000;
export const connectedDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`).then(() => {
            console.log(`MongoDb connected scuccessfully...`);
        });
    }
    catch (error) {
        console.error(error);
    }
};
//# sourceMappingURL=db.configs.js.map