import AppError from "@shared/errors/AppError";

import FakeAppointmentRepository from "../repositories/fakes/FakeAppointmentsRepository";
import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointment: CreateAppointmentService;

describe("CreateAppointment", () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentRepository
        );
    });

    it("should be able to create a new appointment", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: "123",
            user_id: "12345",
        });

        expect(appointment).toHaveProperty("id");
        expect(appointment.provider_id).toBe("123");
    });

    it("should not be able to create two appointments on the same time", async () => {
        const appointmentDate = new Date(2020, 10, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            provider_id: "123",
            user_id: "12345",
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: "123",
                user_id: "12345",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment on a past date", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                provider_id: "123",
                user_id: "12345",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment with same user as provider", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 11).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 12),
                provider_id: "123",
                user_id: "123",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create an appointment before 8am and after 5pm", async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 7),
                provider_id: "123",
                user_id: "12345",
            })
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 11, 18),
                provider_id: "123",
                user_id: "12345",
            })
        ).rejects.toBeInstanceOf(AppError);
    });

});
