import { Router } from "express";
import { ApplicationController } from "../controller/ApplicationController";

const applicationRouter = Router();
const applicationController = new ApplicationController();

applicationRouter.post("/create", async (req, res) => {
    await applicationController.createApplication(req, res);
    }
);

applicationRouter.get("/course/:id", async (req, res) => {
    await applicationController.getApplicationsAndUsersByCourseId(req, res);
});

applicationRouter.get("/course/:id/filtered", async (req, res) => {
    await applicationController.getFilteredAppilicationsByCourseId(req, res);
});

applicationRouter.post("/accept/:id", async (req, res) => {
    await applicationController.acceptApplication(req, res);
});

applicationRouter.post("/:id", async (req, res) => {
    await applicationController.updateApplication(req, res);
});;

applicationRouter.get("/summary/course/:id", async (req, res) => {
    await applicationController.getCourseApplicantSummary(req, res);
});

export default applicationRouter;