const express = require("express");
const router = express.Router();
const { createDevice, getAllDevices, getSingleDevice, deleteDevice, updateDevice } = require("../Controller/devicectrl");

// ✅ Create Device
router.post("/", createDevice);  // ✅ Create Device
router.get("/", getAllDevices);     // ✅ Get All Devices
//router.get("/:id", getSingleDevice); // ✅ Get Single Device
router.get("/:deviceId/:brandId/:categoryId/:shopId", getSingleDevice);
router.patch("/:id", updateDevice); // ✅ Update Device
router.delete("/:id", deleteDevice); // ✅ Delete Device

module.exports = router;
