"use client";

import { useActionState } from "react";
import {
  acceptCaregiverInvitation,
  createCaregiverInvitation,
  createChild,
  revokeCaregiver,
  updateChild,
  updateGuardianProfile,
  type ProfileActionState,
} from "./actions";
import { Feedback, Submit, TextField } from "@/components/forms/form-fields";
import type { Database } from "@/lib/supabase/types";

const initialState: ProfileActionState = {};
type Child = Database["public"]["Tables"]["children"]["Row"];

export function GuardianProfileForm({ fullName }: { fullName: string }) {
  const [state, action, pending] = useActionState(updateGuardianProfile, initialState);
  return (
    <form action={action} className="max-w-xl space-y-5">
      <Feedback state={state} />
      <TextField id="fullName" label="Your name" defaultValue={fullName} autoComplete="name" />
      <Submit label="Save profile" pending={pending} />
    </form>
  );
}

export function NewChildForm() {
  const [state, action, pending] = useActionState(createChild, initialState);
  return (
    <form action={action} className="space-y-5">
      <Feedback state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="firstName" label="First name" autoComplete="given-name" />
        <TextField id="lastName" label="Last name" autoComplete="family-name" />
      </div>
      <TextField id="preferredName" label="Name they go by" required={false} />
      <TextField id="birthDate" label="Date of birth" type="date" />
      <p className="text-xs leading-5 text-muted-foreground">Child profiles are private to you unless you invite a caregiver.</p>
      <Submit label="Create child profile" pending={pending} />
    </form>
  );
}

export function EditChildForm({ child }: { child: Child }) {
  const [state, action, pending] = useActionState(updateChild, initialState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={child.id} />
      <Feedback state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="firstName" label="First name" defaultValue={child.first_name} autoComplete="given-name" />
        <TextField id="lastName" label="Last name" defaultValue={child.last_name} autoComplete="family-name" />
      </div>
      <TextField id="preferredName" label="Name they go by" defaultValue={child.preferred_name ?? ""} required={false} />
      <TextField id="birthDate" label="Date of birth" type="date" defaultValue={child.birth_date} />
      <Submit label="Save child profile" pending={pending} />
    </form>
  );
}

export function CaregiverInvitationForm({ childId }: { childId: string }) {
  const [state, action, pending] = useActionState(createCaregiverInvitation, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="childId" value={childId} />
      <Feedback state={state} />
      <TextField id="email" label="Caregiver email" type="email" autoComplete="email" />
      <p className="text-xs leading-5 text-muted-foreground">Invited caregivers can view this profile but cannot edit it. The invite link expires after seven days.</p>
      <Submit label="Create invitation link" pending={pending} />
    </form>
  );
}

export function RevokeCaregiverForm({ childId, userId, email }: { childId: string; userId: string; email: string }) {
  const [state, action, pending] = useActionState(revokeCaregiver, initialState);
  return (
    <form action={action} className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-3">
      <input type="hidden" name="childId" value={childId} />
      <input type="hidden" name="userId" value={userId} />
      <span className="min-w-0 break-all text-sm text-foreground">{email}</span>
      <div className="flex items-center gap-3">
        {state.error ? <span role="alert" className="text-xs text-destructive">{state.error}</span> : null}
        <button type="submit" disabled={pending} className="min-h-9 rounded-md px-3 text-sm font-medium text-destructive underline-offset-4 hover:underline disabled:opacity-60">
          {pending ? "Removing…" : "Remove access"}
        </button>
      </div>
    </form>
  );
}

export function AcceptInvitationForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(acceptCaregiverInvitation, initialState);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <Feedback state={state} />
      <p className="text-sm leading-6 text-muted-foreground">Accepting gives your account read-only access to the child profile. Your email must match the invitation and be verified.</p>
      <Submit label="Accept invitation" pending={pending} />
    </form>
  );
}
