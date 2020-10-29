import {
    Entity,
    ObjectID,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ObjectIdColumn,
} from "typeorm";

@Entity("notifications")
class Notification {
    //ObjectID é o formato do ID armazenado no mongo
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column("uuid")
    recipient_id: string;

    @Column({ default: false })
    read: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Notification;
