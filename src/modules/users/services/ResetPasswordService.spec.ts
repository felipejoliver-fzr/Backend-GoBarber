import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "@shared/container/providers/MailProvider/Fakes/FakeMailProvider";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokenRepository";
import ResetPasswordService from "./ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;

describe("ResetPasswordService", () => {
    // é chamado sempre antes de executar cada teste, para que o que foi preenchido em cada teste, não interfira nos próximos
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository
        );
    });

    it("should be able to reset the password", async () => {
        let user = await fakeUsersRepository.create({
            name: "Test",
            email: "teste@email.com",
            password: "12345",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPassword.execute({
            password: "123123",
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(updatedUser?.password).toBe("123123");
    });
});
