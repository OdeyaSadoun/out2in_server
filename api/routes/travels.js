const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middleware/auth");
const { travelCtrl } = require("../controllers/travels.controller");

router.get("/allTravelsList", authAdmin, travelCtrl.getAllTravels);

router.get("/travelsUserList", auth, travelCtrl.getAllUserTravels);

router.get("/single/:idTravel", auth, travelCtrl.getTravelById);

router.get("/search", auth, travelCtrl.searchByPriceOrPaymentType);

router.get("/searchByPriceRange", auth, travelCtrl.searchByPriceRange);

router.post("/", auth, travelCtrl.addTravel);

router.put("/:idEdit", auth, travelCtrl.editTravel);

router.delete("/:idDelete", auth, travelCtrl.deleteTravel);

module.exports = router;
