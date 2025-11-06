
import { SettingsContent } from "@/components/settings/settings-content";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </header>
      <SettingsContent />
    </div>
  );
}
