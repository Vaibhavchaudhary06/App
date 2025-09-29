import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI); // <- yahi par undefined aa raha hai
    app.listen(PORT, () => console.log(` Server running on :${PORT}`));
  } catch (e) {
    console.error("DB connection failed", e);
    process.exit(1);
  }
};

start();
