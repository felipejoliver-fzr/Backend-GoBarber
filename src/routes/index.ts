import { Router } from "express";
import appoitmentsRoutes from "./appointments.routes";

const routes = Router();

routes.use('/appointments', appoitmentsRoutes);

export default routes;
