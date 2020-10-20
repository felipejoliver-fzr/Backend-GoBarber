import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeMailProvider from "@shared/container/providers/MailProvider/Fakes/FakeMailProvider";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokenRepository";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe("SendForgotPasswordEmail", () => {
    // é chamado sempre antes de executar cada teste, para que o que foi preenchido em cada teste, não interfira nos próximos
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository
        );
    });

    it("should be able to recover the password using the email", async () => {
        const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

        await fakeUsersRepository.create({
            name: "Test",
            email: "teste@email.com",
            password: "12345",
        });

        await sendForgotPasswordEmail.execute({
            email: "teste@email.com",
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it("should not be able to recover a non-existing user password", async () => {
        await expect(
            sendForgotPasswordEmail.execute({
                email: "teste@email.com",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should generate a forgot password token", async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

        const user = await fakeUsersRepository.create({
            name: "Test",
            email: "teste@email.com",
            password: "12345",
        });

        await sendForgotPasswordEmail.execute({
            email: "teste@email.com",
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
