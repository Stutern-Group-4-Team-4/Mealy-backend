import dotenv from "dotenv";
dotenv.config()

export const development = {
    mongodb_connection_url: ProcessingInstruction.env.DEV_MONGODB_CONNECTION_URL,
    port: +process.env.PORT
};