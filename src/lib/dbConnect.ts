import mongoose from "mongoose";

//readyState provides a number on that number we identify that is DB is Connected or not and this is optional
type ConnectObject = {
  isConnected?: number;
};

const connection: ConnectObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("Database is already Connected...");
    return;
  }
  try {
    const db = await mongoose.connect(String(process.env.DATABASE_URL) || "", {
      dbName: "mstrymessage",
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully...");
  } catch (error) {
    console.log(error, "Database connection failed");
    process.exit(1);
  }
}

export default dbConnection;
