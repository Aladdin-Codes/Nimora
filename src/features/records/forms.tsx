"use client";

import { useActionState } from "react";
import { createAppointment, createGrowthMeasurement, createVaccinationRecord } from "./actions";
import { Feedback, Submit, TextAreaField, TextField, type FormState } from "@/components/forms/form-fields";

const initialState: FormState = {};

export function GrowthMeasurementForm({ childId }: { childId: string }) {
  const [state, action, pending] = useActionState(createGrowthMeasurement, initialState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="childId" value={childId} />
      <Feedback state={state} />
      <TextField id="measuredOn" label="Measurement date" type="date" />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="weightKg" label="Weight (kg)" inputMode="decimal" step="0.01" min="0" max="200" />
        <TextField id="heightCm" label="Height (cm)" inputMode="decimal" step="0.01" min="0" max="250" />
      </div>
      <TextAreaField id="notes" label="Notes (optional)" />
      <Submit label="Save measurement" pending={pending} />
    </form>
  );
}

export function VaccinationRecordForm({ childId }: { childId: string }) {
  const [state, action, pending] = useActionState(createVaccinationRecord, initialState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="childId" value={childId} />
      <Feedback state={state} />
      <TextField id="vaccineName" label="Vaccine name" />
      <TextField id="doseLabel" label="Dose" />
      <TextField id="administeredOn" label="Date given" type="date" />
      <TextAreaField id="notes" label="Notes (optional)" />
      <Submit label="Save vaccination" pending={pending} />
    </form>
  );
}

export function AppointmentForm({ childId }: { childId: string }) {
  const [state, action, pending] = useActionState(createAppointment, initialState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="childId" value={childId} />
      <Feedback state={state} />
      <TextField id="title" label="Appointment" />
      <TextField id="providerName" label="Clinic or provider" />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="scheduledDate" label="Date" type="date" />
        <TextField id="scheduledTime" label="Time" type="time" />
      </div>
      <TextAreaField id="notes" label="Notes (optional)" />
      <Submit label="Save appointment" pending={pending} />
    </form>
  );
}
