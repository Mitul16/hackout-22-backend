const express = require("express");
const router = express.Router();
const {
  acceptRequest,
  rejectRequest,
} = require("../controllers/requestControllers");

const { protected } = require("../middlewares/authMiddleware");

router.route("/accept/:requestId").post(protected, acceptRequest);
router.route("/reject/:requestId").delete(protected, rejectRequest);

module.exports = router