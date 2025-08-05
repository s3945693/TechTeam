import { Router } from "express";
import { CourseController } from "../controller/CourseController";

const courseRouter = Router();
const courseController = new CourseController();

// Course routes - ordered from most specific to least specific
courseRouter.get("/filter", async (req, res) => {
  await courseController.filterCourses(req, res);
});

courseRouter.get("/lecturer/:id", async (req, res) => {
  await courseController.getAllCoursesForLecturer(req, res);
});

courseRouter.get("/candidate/:id/unapplied", async (req, res) => {
  await courseController.getUnappliedCoursesForCandidate(req, res);
});

courseRouter.get("/candidate/:id/applied", async (req, res) => {
  await courseController.getAppliedCourseIdsForCandidate(req, res);
});

courseRouter.get("/:id", async (req, res) => {
  await courseController.getCourseById(req, res);
});

courseRouter.get("/", async (req, res) => {
  await courseController.getAllCourses(req, res);
});

export default courseRouter;