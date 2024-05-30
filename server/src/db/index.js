import mongoose from "mongoose";
const MongoConnect = async () => {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGO_DB_URI}/${process.env.DB_NAME}`
    );
    console.log(
      `⭐ MONGO CONNECTION SUCCESSFULL ⭐ !! ${response.connection.host}`
    );
  } catch (error) {
    console.error("MONGO CONNECTION ERROR ", error);
    process.exit(1);
  }
};

export { MongoConnect };
