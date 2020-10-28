import { injectable, inject } from "tsyringe";
import { getDaysInMonth, getDate } from "date-fns";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import User from "@modules/users/infra/typeorm/entities/User";
import IFindAllProvidersDTO from "../dtos/IFindAllProvidersDTO";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject("AppointmentsRepository")
        private appointmentsRepository: IAppointmentsRepository
    ) {}

    public async execute({
        provider_id,
        year,
        month,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
            {
                provider_id,
                year,
                month,
            }
        );

        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        //cria um array de tamanho igual aos dias do mes com cada posição tendo como valor o dia. Ex: [1, 2, 3, 4, 5]
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1
        );

        const availability = eachDayArray.map((day) => {
            //filtra todos os agendamentes do dia
            const appointmentsInDay = appointments.filter((appointment) => {
                return getDate(appointment.date) === day;
            });

            //se nesse dia tiver menos do que 10 agendamentos, tem horario disponivel
            return {
                day,
                available: appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
