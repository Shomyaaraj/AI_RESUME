const { Router } = require("express");
const interviewController = require("../controllers/interview.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const interviewRouter = Router();

// Protect all routes with authMiddleware
interviewRouter.use(authMiddleware.authUser);

/**
 * @route POST /api/interview/generate
 * @description Generate a new AI interview report
 */
interviewRouter.post("/generate", interviewController.generateReportController);

/**
 * @route GET /api/interview/reports
 * @description Get all reports for authenticated user
 */
interviewRouter.get("/reports", interviewController.getUserReportsController);

/**
 * @route GET /api/interview/reports/:id
 * @description Get single report by ID
 */
interviewRouter.get("/reports/:id", interviewController.getReportByIdController);

/**
 * @route DELETE /api/interview/reports/:id
 * @description Delete report by ID
 */
interviewRouter.delete("/reports/:id", interviewController.deleteReportController);

module.exports = interviewRouter;
