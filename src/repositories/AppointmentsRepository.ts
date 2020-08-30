import Appointment from '../models/Appointment';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {

    public async findByDate(date: Date): Promise<Appointment | null> {

        const findAppointment = await this.findOne({
            where: { date: date },
        })

        //se tiver um appointment ele retorna o objet, se não retorna null
        return findAppointment || null;
    }

}

export default AppointmentsRepository;
