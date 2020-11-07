import { injectable, inject } from "tsyringe";
import { classToClass } from "class-transformer";

import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import User from "@modules/users/infra/typeorm/entities/User";
import IFindAllProvidersDTO from "../dtos/IFindAllProvidersDTO";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";


interface IRequest {
    user_id: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("CacheProvider")
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({
        except_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let users = await this.cacheProvider.recover<User[]>(`providers-list:${except_user_id}`);

        if(!users) {
            users = await this.usersRepository.findAllProviders({
                except_user_id,
            });

            await this.cacheProvider.save(`providers-list:${except_user_id}`, classToClass(users));
        }


        return users;
    }
}

export default ListProvidersService;
