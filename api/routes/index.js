const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    res.json({msg: "api work project 3"});
});

module.exports = router;