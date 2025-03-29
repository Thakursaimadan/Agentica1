import { Router } from "express";
import pool from "../db.js";
import upload from "../middleware/multer.js";
import { v2 as cloudinary } from "cloudinary";

// Todo: Change mess functionality

const adminRouter = Router();

// To get all the today's special items
adminRouter.get("/get-special-items", async (req, res) => {
	try {
		const special_items = await pool.query(`SELECT * FROM Special_items`);

		if (special_items.rows.length === 0) {
			return res.status(404).json({
				message: "No special items found",
			});
		}

		return res.status(200).json({
			special_items: special_items.rows,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error getting special items",
		});
	}
});

// To add special item to today's menu
adminRouter.post("/add-special-item", async (req, res) => {
	try {
		const { item_id, mess_id, price, start_time, end_time } = req.body;

		const insertItem = await pool.query(
			`INSERT INTO Today_special_items (item_id, mess_id, price, start_time, end_time) 
			VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[item_id, mess_id, price, start_time, end_time]
		);

		if (insertItem.rows.length === 0) {
			return res.status(500).json({
				message: "Error adding today's special item",
			});
		}

		return res.status(200).json({
			message: "Today's special item added successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

// To add an announcement in the main page
adminRouter.post("/add-announcement", async (req, res) => {
	try {
		const { mess_id, content, start_time, end_time } = req.body;

		const insertAnnouncement = await pool.query(
			`INSERT INTO Announcements (mess_id, content, start_time, end_time) 
			VALUES ($1, $2, $3, $4) RETURNING *`,
			[mess_id, content, start_time, end_time]
		);

		if (insertAnnouncement.rows.length === 0) {
			return res.status(500).json({
				message: "Error adding announcement",
			});
		}

		return res.status(200).json({
			message: "Announcement added successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

// To remove an announcement from the main page
adminRouter.delete(
	"/delete-announcement/:announcement_id",
	async (req, res) => {
		try {
			const { announcement_id } = req.params;

			await pool.query(
				`DELETE FROM Announcements 
				WHERE announcement_id = $1`,
				[announcement_id]
			);

			return res.status(200).json({
				message: "Announcement deleted successfully",
			});
		} catch (err) {
			console.log(err);
			return res.status(500).json({
				message: "Error removing announcement",
			});
		}
	}
);

// To get all the announcements
adminRouter.get("/get-announcements", async (req, res) => {
	try {
		const announcements = await pool.query(`SELECT * FROM Announcements`);

		if (announcements.rows.length === 0) {
			return res.status(404).json({
				message: "No announcements found",
			});
		}

		return res.status(200).json({
			announcements: announcements.rows,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Error fetching announcements",
		});
	}
});

//View current orders
adminRouter.get("/get-orders", async (req, res) => {
	try {
		const orders = await pool.query(
			`SELECT OI.quantity, S.name FROM  
            Orders O 
            JOIN Order_items OI 
            ON O.order_id = OI.order_id 
            JOIN Special_items S
            ON S.item_id = OI.item_id
            WHERE O.is_redeemed = $1`,
			[false]
		);

		if (orders.rows.length === 0) {
			return res.status(404).json({
				message: "No orders found",
			});
		}

		console.log(orders.rows);
		return res.status(200).json({
			orders: orders.rows,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
});

// To add a new special item
adminRouter.post("/add-item", upload.single("file"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}
		//console.log(req.file);
		const { item_name } = req.body;

		//upload to cloudinary
		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{
					public_id: req.file.originalname.split(".")[0],
					resource_type: "image",
				},
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			stream.end(req.file.buffer);
		});

		const url = result.secure_url;

		const insertImage = await pool.query(
			`INSERT INTO special_items (name, url) VALUES ($1, $2) RETURNING *`,
			[item_name, url]
		);

		if (insertImage.rows.length === 0) {
			return res.status(500).json({
				message: "Internal server error",
			});
		}

		return res.status(200).json({
			message: "Item uploaded successfully",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error" });
	}
});

export default adminRouter;
