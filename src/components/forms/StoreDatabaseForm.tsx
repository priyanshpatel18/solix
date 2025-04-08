"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { montserrat } from "@/fonts/fonts";
import { databaseFormSchema } from "@/schema/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { User } from "../UserContext";

type DatabaseFormValues = z.infer<typeof databaseFormSchema>;

interface DatabaseFormProps {
  setShowStoreDatabaseForm: Dispatch<SetStateAction<boolean>>;
  setCompletedSteps?: Dispatch<SetStateAction<number[]>>;
  setUser: Dispatch<SetStateAction<User | null>>;
}

export default function StoreDatabaseForm({ setShowStoreDatabaseForm, setCompletedSteps, setUser }: DatabaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionString, setConnectionString] = useState("");
  const form = useForm({ resolver: zodResolver(databaseFormSchema) });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      setShowStoreDatabaseForm(false);
    }
  }, [form.formState.isSubmitSuccessful, setShowStoreDatabaseForm]);

  const parseConnectionString = () => {
    try {
      const urlPattern = /^(?:([^:]+):\/\/)?(?:([^:@]+)(?::([^@]+))?@)?([^:/?#]+)(?::(\d+))?(?:\/([^?#]+))?/;
      const matches = connectionString.match(urlPattern);

      if (!matches) {
        throw new Error("Invalid connection string format");
      }

      const [, protocol, username, password, host, port, dbName] = matches;

      if (!host) {
        throw new Error("Could not extract host from connection string");
      }

      // Update form fields
      form.setValue("host", host);
      if (username) form.setValue("username", username);
      if (password) form.setValue("password", password);
      form.setValue("port", "5432");
      if (dbName) form.setValue("dbName", dbName);

      toast.success("Connection details parsed successfully!");
    } catch (error) {
      console.error("Parsing error:", error);
      toast.error("Failed to parse connection string. Please check the format.");
    }
  };

  const onSubmit = async (data: DatabaseFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/database/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      });

      if (response.ok) {
        const { database } = await response.json();

        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              databases: [...prevUser.databases, database],
            };
          }
          return prevUser;
        });

        toast.success("Database connection saved!");
        if (setCompletedSteps)
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
    <>
      <DialogHeader>
        <DialogTitle className={`text-2xl font-semibold ${montserrat}`}>Database Setup</DialogTitle>
      </DialogHeader>
      <p className="text-muted-foreground mb-6">Enter your database connection details to begin indexing.</p>

      {/* Connection URL Parser Section */}
      <div className="space-y-2 mb-6">
        <Label htmlFor="connectionString">Connection URL (optional)</Label>
        <div className="flex gap-2">
          <Input
            id="connectionString"
            placeholder="e.g., postgres://user:pass@host:5432/dbname"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={parseConnectionString}
            disabled={!connectionString}
          >
            Parse
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste your full connection string to auto-fill the form below
        </p>
      </div>

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
        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Connection"}
        </Button>
      </form>
    </>
  )
}