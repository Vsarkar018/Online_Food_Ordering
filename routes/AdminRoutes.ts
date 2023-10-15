import express from "express";
import { CreateVendor, GetVendor, GetVendorByID } from "../controllers";
const router = express.Router();

router.post("/vendor", CreateVendor);
router.get("/vendor", GetVendor);
router.get("/vendor/:id", GetVendorByID);

export { router as AdminRoutes };
