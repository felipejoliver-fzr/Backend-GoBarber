import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokenRepository";
import ResetPasswordService from "./ResetPasswordService";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe("ResetPasswordService", () => {
    // é chamado sempre antes de executar cada teste, para que o que foi preenchido em cada teste, não interfira nos próximos
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        );
    });

    it("should be able to reset the password", async () => {
        let user = await fakeUsersRepository.create({
            name: "Test",
            email: "teste@email.com",
            password: "12345",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

        await resetPassword.execute({
            password: "123123",
            token,
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith("123123");
        expect(updatedUser?.password).toBe("123123");
    });

    it("should not be able to reset the password with non-existing token", async () => {
        await expect(
            resetPassword.execute({
                token: "123",
                password: "12345",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to reset the password with non-existing user", async () => {
        const { token } = await fakeUserTokensRepository.generate("123");

        await expect(
            resetPassword.execute({
                token,
                password: "12345",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to reset password if passed more than 2 hours", async () => {
        let user = await fakeUsersRepository.create({
            name: "Test",
            email: "teste@email.com",
            password: "12345",
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        /*o mockImplementationOnce é para alterar a função Date.now() apenas na primeira vez em que é chamado
        se for em mais de uma, irá executar sua função padrão*/
        jest.spyOn(Date, "now").mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                password: "123123",
                token,
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
