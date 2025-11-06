
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button";
import { AccessibilitySettings } from "./accessibility-settings";

export function SettingsContent() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="grid gap-8">
      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Accessibility & Appearance</CardTitle>
          <CardDescription>
            Customize the look, feel, and accessibility of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccessibilitySettings />
        </CardContent>
      </Card>


      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Notifications</CardTitle>
          <CardDescription>
            Choose how you receive notifications from the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about tickets and appointments via email.
              </p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="font-medium">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get real-time alerts in your browser. (Coming soon)
              </p>
            </div>
            <Switch id="push-notifications" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Account</CardTitle>
          <CardDescription>
            Manage your account settings and security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm text-muted-foreground">
                Update your login password for enhanced security.
              </p>
            </div>
            <Button variant="outline">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
