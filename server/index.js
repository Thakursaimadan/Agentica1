import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import connectCloudinary from "./middleware/cloudinary.js";

app.use(cors());
app.use(express.json());
connectCloudinary();

app.use("/users", userRouter);
app.use("/admin", adminRouter);

// console.log();

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
