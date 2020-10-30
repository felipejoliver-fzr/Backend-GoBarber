import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

export default class SessionsController {
    async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const authenticateUser = container.resolve(AuthenticateUserService);

        const { user, token } = await authenticateUser.execute({
            email,
            password,
        });

        //classToClass serve para aplicar as propriedades @Exclude() e @Expose() inseridas da User.ts
        return response.json({ user: classToClass(user), token });
    }
}
