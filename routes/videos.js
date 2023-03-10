import express from "express";
import { addVideo, addView, getByTag, getVideo, random, search, sub, trend , isSponsorred , getallevents , getVideoById , newcooment ,fechusersvideos } from "../controllers/video.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

//create a video
router.post("/:id",  addVideo)
router.put("/:id",  addVideo)
router.delete("/:id",  addVideo)
router.get("/find/:id", getVideo)
router.put("/view/:id", addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/sub", sub)
router.get("/tags", getByTag)
router.get("/search", search)
router.get("/isSponsorred", isSponsorred)
router.get("/", getallevents)
router.get("/:id", getVideoById)
router.put("/comments/:id", newcooment);
router.get("/getusers/:id",fechusersvideos)



export default router;
