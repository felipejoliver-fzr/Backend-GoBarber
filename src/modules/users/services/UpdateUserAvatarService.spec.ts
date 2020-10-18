import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeStorageProvider from "@shared/container/providers/StoragedProvider/fakes/FakeStorageProvider";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

describe("UpdateUserAvatar", () => {
    it("should be able to create a new avatar user", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );

        const user = await fakeUsersRepository.create({
            name: "Teste",
            email: "email@teste.com.br",
            password: "12345",
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: "avatar.jpg",
        });

        expect(user.avatar).toBe("avatar.jpg");
    });

    it("should not be able to update avatar from non existing user", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();
        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );

        expect(
            updateUserAvatar.execute({
                user_id: "0",
                avatarFilename: "avatar.jpg",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should delete old avatar when updating new one", async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        //espiona a função deleteFile dentro de fakeStorageProvider para saber se ela foi executada
        const deleteFile = jest.spyOn(fakeStorageProvider, "deleteFile");

        const updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider
        );

        const user = await fakeUsersRepository.create({
            name: "Teste",
            email: "email@teste.com.br",
            password: "12345",
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: "avatar.jpg",
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: "avatar2.jpg",
        });

        //expectativa de que a deleFile foi chamada com o parametro avatar.jpg
        expect(deleteFile).toHaveBeenCalledWith("avatar.jpg");

        expect(user.avatar).toBe("avatar2.jpg");
    });
});
