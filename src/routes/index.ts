import { Router } from "express";
import appoitmentsRoutes from "./appointments.routes";
import usersRoutes from "./users.routes";

const routes = Router();

routes.use('/appointments', appoitmentsRoutes);
routes.use('/users', usersRoutes);

export default routes;
