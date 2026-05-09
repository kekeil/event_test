import { EventForm } from "@/components/event-form";

export default function AdminNewEventPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Nouvel évènement
      </h1>
      <EventForm mode="create" />
    </main>
  );
}
