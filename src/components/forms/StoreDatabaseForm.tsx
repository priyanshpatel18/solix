"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { montserrat } from "@/fonts/fonts";
import { databaseFormSchema } from "@/schema/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type DatabaseFormValues = z.infer<typeof databaseFormSchema>;

interface DatabaseFormProps {
  setShowStoreDatabaseForm: Dispatch<SetStateAction<boolean>>;
  setCompletedSteps: Dispatch<SetStateAction<number[]>>;
}

export default function StoreDatabaseForm({ setShowStoreDatabaseForm, setCompletedSteps }: DatabaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({ resolver: zodResolver(databaseFormSchema) });

  const onSubmit = async (data: DatabaseFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/database/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      if (response.ok) {
        toast.success("Database connection saved!");
        setCompletedSteps((prev) => [...prev, 0]);
      } else {
        const errorData = await response.json();
        toast.error(errorData?.error || "Something went wrong while saving.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
      setShowStoreDatabaseForm(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className={`text-2xl font-semibold ${montserrat}`}>Database Setup</DialogTitle>
      </DialogHeader>
      <p className="text-muted-foreground mb-6">Enter your database connection details to begin indexing.</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Connection Name</Label>
          <Input id="name" placeholder="e.g., Production DB" {...form.register("name")} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="host">Host</Label>
            <Input id="host" placeholder="e.g., localhost" {...form.register("host")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="port">Port</Label>
            <Input id="port" type="number" placeholder="5432" {...form.register("port")} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Database username" {...form.register("username")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Database password" {...form.register("password")} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dbName">Database Name</Label>
          <Input id="dbName" placeholder="e.g., my_database" {...form.register("dbName")} />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Connection"}
        </Button>
      </form>
    </DialogContent>
  )
}