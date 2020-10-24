import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("UpdateProfileService", () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    it("should be able to update the profile", async () => {
        const user = await fakeUsersRepository.create({
            name: "Teste",
            email: "email@teste.com.br",
            password: "12345",
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "Teste 2",
            email: "email2@teste.com.br",
        });

        expect(updatedUser.name).toBe("Teste 2");
    });

    it("should not be able update the profile from non-existing user", async () => {
        expect(
            updateProfile.execute({
                user_id: "1",
                name: "Teste 2",
                email: "email2@teste.com.br",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to change to another user email", async () => {
        await fakeUsersRepository.create({
            name: "Teste",
            email: "email@teste.com.br",
            password: "12345",
        });

        const user = await fakeUsersRepository.create({
            name: "Teste 1",
            email: "email1@teste.com.br",
            password: "12345",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "Teste 1",
                email: "email@teste.com.br",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to update the password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Teste",
            email: "email@teste.com.br",
            password: "12345",
        });

        const updatedUser = await updateProfile.execute({
            user_id: user.id,
            name: "Teste 2",
            email: "email2@teste.com.br",
            old_password: "12345",
            password: "00000",
        });

        expect(updatedUser.password).toBe("00000");
    });

    it("should not be able to update the password without old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Teste",
            email: "email@teste.com.br",
            password: "12345",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "Teste 2",
                email: "email2@teste.com.br",
                password: "00000",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to update the password with wrong old password", async () => {
        const user = await fakeUsersRepository.create({
            name: "Teste",
            email: "email@teste.com.br",
            password: "12345",
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: "Teste 2",
                email: "email2@teste.com.br",
                old_password: "01010",
                password: "00000",
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
