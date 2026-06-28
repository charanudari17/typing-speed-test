// import mongoose from "mongoose";

// const connectDB= async()=>{
//     try {
//     const connectionInstance= await mongoose.connect(process.env.MONGODB_URI);
//     const host = connectionInstance.connection?.host || connectionInstance.host || 'unknown-host';
//     console.log(`Mongodb connected successfully to ${DB_NAME} on ${host}`);
//     } catch (error) {
//         console.log("Mongodb.   connection failed",error);
//         process.exit(1);

        
//     }
// }
// export default connectDB;
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `MongoDB connected successfully to ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;