import { getMongoRepository, MongoRepository } from "typeorm";

import { INotificationsRepository } from "@modules/notifications/repositories/INotificationRepository";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import Notification from "../schemas/Notification";

class NotificationsRepository implements INotificationsRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        //como a conexão com o mongo não é a padrao, é necessario passar o nome da conexão que foi definida no ormconfig
        this.ormRepository = getMongoRepository(Notification, "mongo");
    }

    public async create({
        content,
        recipient_id,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipient_id,
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}

export default NotificationsRepository;
