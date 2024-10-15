"use client";

import React, { useEffect, useTransition, useState } from "react";

import ServicesList from "@/components/ServicesList";

import { DatePickerForm } from "@/components/DatePickerForm";

import { AppointmentSchema } from "@/schemas";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { Form } from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { useSession } from "next-auth/react";

import { useToast } from "@/components/ui/use-toast";

import { useCurrentUserDetails } from "@/hooks/use-current-user-details";

import { Toaster } from "@/components/ui/toaster";

import { getUnavailableTimes } from "@/actions/appointments";

import { payment } from "@/actions/payment";

import { createAppointment } from "@/actions/appointments";
import TimeList from "@/components/TimeList";

interface Service {
  id: string;

  name: string;
  price: string;
}

const ClientPage: React.FC = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [isPending] = useTransition();

  const [error, setError] = useState<string | undefined>();

  const [success, setSuccess] = useState<string | undefined>();

  const { update } = useSession();

  const userDetails = useCurrentUserDetails();

  const { toast } = useToast();

  const [unavailableTimes, setUnavailableTimes] = useState<string[]>([]);

  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const total = selectedServices.reduce(
      (accumulator, service) => accumulator + parseFloat(service.price),

      0
    );

    setTotalPrice(total);
  }, [selectedServices]);

  const handleDateSelection = (date: string | undefined) => {
    if (date) {
      setSelectedDate(date);

      getUnavailableTimes(date)
        .then((data) => {
          if (!data.success) {
            setError(data.error);
          }
        })
        .catch(() => setError("Algo salió mal"));
    } else {
      setSelectedDate(null);
    }
  };

  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      userName: userDetails?.name || "",
      userEmail: userDetails?.email || "",
      date: "",
      time: "",
      services: selectedServices.map((service) => ({
        name: service.name,
        price: parseFloat(service.price),
      })),
      totalPrice: totalPrice,
    },
  });

  const formattedTotalPrice = totalPrice.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const onSubmit = async (values: z.infer<typeof AppointmentSchema>) => {
    const updatedValues = {
      userName: userDetails?.name || "",
      userEmail: userDetails?.email || "",
      date: selectedDate || "",
      time: selectedTime || "",
      services: selectedServices.map((service) => ({
        name: service.name,
        price: parseFloat(service.price),
      })),
      totalPrice: totalPrice,
    };

    localStorage.setItem("appointmentData", JSON.stringify(updatedValues));

    if (
      !updatedValues.date ||
      !updatedValues.time ||
      updatedValues.services.length === 0
    ) {
      toast({
        title: "Error",

        description:
          "Por favor, complete todos los campos para agendar el turno",

        variant: "destructive",
      });

      return;
    }

    try {
      const { redirectUrl } = await payment(totalPrice, {
        userName: userDetails?.name || "",

        userEmail: userDetails?.email || "",

        date: selectedDate || "",

        time: selectedTime || "",
        services: selectedServices.map((service) => ({
          name: service.name,

          price: parseFloat(service.price),
        })),
      });

      window.location.href = redirectUrl;
    } catch (error) {
      setError("Algo salió mal durante el pago");
    }
  };

  const handleServiceSelection = (service: Service) => {
    const isServiceSelected = selectedServices.some(
      (s) => s.name === service.name
    );

    if (isServiceSelected) {
      setSelectedServices(
        selectedServices.filter((s) => s.name !== service.name)
      );
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);

    const collectionStatus = queryParams.get("collection_status");

    if (collectionStatus === "approved") {
      const scheduleAppointment = async () => {
        const updatedValues = {
          userName: userDetails?.name || "",

          userEmail: userDetails?.email || "",

          date: selectedDate || "",

          time: selectedTime || "",

          services: selectedServices.map((service) => service.name),
        };

        if (
          !updatedValues.date ||
          !updatedValues.time ||
          updatedValues.services.length === 0
        ) {
          setError(
            "No se puede agendar el turno. Por favor, completa todos los campos."
          );

          return;
        }
        try {
          const totalPrice = selectedServices.reduce(
            (acc: number, service: Service) => acc + parseFloat(service.price),
            0
          );
          const servicesWithPrice = selectedServices.map(
            (service: Service) => ({
              name: service.name,
              price: parseFloat(service.price),
            })
          );
          const updatedValuesWithTotalPrice = {
            ...updatedValues,
            totalPrice,
            services: servicesWithPrice,
          };
          await createAppointment(updatedValuesWithTotalPrice);

          update();

          setSuccess("Turno agendado exitosamente");

          toast({
            title: "Turno agendado",

            description: `El día ${selectedDate}`,
          });

          window.location.href = redirectUrl || "";
        } catch (error) {
          setError("Hubo un error al agendar el turno");
        }
      };

      scheduleAppointment();
    }
  }, [
    selectedDate,

    selectedServices,

    selectedTime,

    toast,

    update,

    userDetails?.email,

    userDetails?.name,

    redirectUrl,
  ]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h1 className="mb-3 text-white flex justify-center">
            Hola, ¿Qué deseas hacerte?
          </h1>

          <ServicesList
            handleServiceSelection={handleServiceSelection}
            selectedServices={selectedServices}
          />

          <div className="max-w-80 bg-white rounded-sm p-4 m-3">
            <h2>A pagar:</h2>

            {selectedServices.length > 0 ? (
              selectedServices.map((service) => (
                <ul key={service.id} className="flex justify-end">
                  <li>{service.name}</li>

                  <li>
                    {parseFloat(service.price).toLocaleString("es-AR", {
                      style: "currency",

                      currency: "ARS",
                    })}
                  </li>
                </ul>
              ))
            ) : (
              <div>No hay servicios seleccionados</div>
            )}

            <div className="text-blue-400">Total: {formattedTotalPrice} </div>
          </div>

          <DatePickerForm onSelectDate={handleDateSelection} />

          <TimeList
            onSelectTime={handleTimeSelection}
            unavailableTimes={unavailableTimes}
          />

          <Button
            disabled={isPending || success !== undefined}
            type="submit"
            className="mt-4 "
          >
            Guardar
          </Button>
        </form>
      </Form>

      <Toaster />
    </>
  );
};

export default ClientPage;
