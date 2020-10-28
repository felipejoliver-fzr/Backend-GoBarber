import { getRepository, Raw, Repository } from "typeorm";

import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

import Appointment from "../entities/Appointment";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date: date },
        });

        //se tiver um appointment ele retorna o objet, se não retorna null
        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        //padStart -> se a string não conter 2 caracteres, inserir 0 à esquerda
        const parsedMonth = String(month).padStart(2, "0");

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    (dateFieldName) =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
                ),
            },
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        //padStart -> se a string não conter 2 caracteres, inserir 0 à esquerda
        const parsedDay = String(day).padStart(2, "0");
        const parsedMonth = String(month).padStart(2, "0");

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    (dateFieldName) =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
                ),
            },
        });

        return appointments;
    }

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
