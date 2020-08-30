import { Router } from "express";
import appoitmentsRoutes from "./appointments.routes";
import usersRoutes from "./users.routes";
import sessionsRoutes from "./sessions.routes";

const routes = Router();

routes.use('/appointments', appoitmentsRoutes);
routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);

export default routes;
