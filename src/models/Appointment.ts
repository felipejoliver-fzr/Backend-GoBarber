import { uuid } from "uuidv4"

class Appointment {
    id: string;

    provider: string;

    date: Date;

    //o Omit server para omitir atributos em que não é desejado na entradad e algum objeto
    constructor({ provider, date }: Omit<Appointment, 'id'>){
        this.id = uuid();
        this.provider = provider;
        this.date = date;
    }
}

export default Appointment;
