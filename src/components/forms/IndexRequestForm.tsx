"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { montserrat } from "@/fonts/fonts";
import { indexRequestSchema } from "@/schema/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cluster, Frequency, IndexCategory, IndexType } from "@prisma/client";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { User } from "../SessionProvder";

const solanaEnvironments = [
  { id: "MAINNET" as Cluster, name: "Mainnet" },
  { id: "DEVNET" as Cluster, name: "Devnet" },
];

const solanaIndexCategories = [
  { id: "TRANSACTIONS" as IndexCategory, name: "Transactions" },
  { id: "TOKEN_TRANSFERS" as IndexCategory, name: "Token Transfers" },
  { id: "NFT_MINTS" as IndexCategory, name: "NFT Mints" },
  { id: "NFT_SALES" as IndexCategory, name: "NFT Sales" },
  { id: "STAKING_ACCOUNTS" as IndexCategory, name: "Staking Accounts" },
  { id: "SMART_CONTRACTS" as IndexCategory, name: "Smart Contracts" },
  { id: "PROGRAM_EXECUTIONS" as IndexCategory, name: "Program Executions" },
  { id: "DEFI_SWAPS" as IndexCategory, name: "DeFi Swaps" },
  { id: "LIQUIDITY_POOLS" as IndexCategory, name: "Liquidity Pools" },
  { id: "ORACLE_UPDATES" as IndexCategory, name: "Oracle Updates" },
  { id: "GOVERNANCE_VOTES" as IndexCategory, name: "Governance Votes" },
  { id: "DOMAIN_REGISTRATIONS" as IndexCategory, name: "Domain Registrations" },
];

const indexTypes = [
  { id: "TRANSACTIONS" as IndexType, name: "Transactions" },
  { id: "TOKEN_ACCOUNTS" as IndexType, name: "Token Accounts" },
  { id: "PROGRAM_LOGS" as IndexType, name: "Program Logs" },
  { id: "NFTS" as IndexType, name: "NFTs" },
];

const frequencies = [
  { id: "REAL_TIME" as Frequency, name: "Real Time" },
  { id: "HOURLY" as Frequency, name: "Hourly" },
  { id: "DAILY" as Frequency, name: "Daily" },
];

type IndexRequestValues = z.infer<typeof indexRequestSchema>;

interface IndexRequestFormProps {
  setShowIndexRequestForm: Dispatch<SetStateAction<boolean>>;
  setCompletedSteps: Dispatch<SetStateAction<number[]>>;
  databases: { id: string; name: string }[];
  setUser: Dispatch<SetStateAction<User | null>>;
}

export default function IndexRequestForm({ setShowIndexRequestForm, setCompletedSteps, databases, setUser }: IndexRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IndexRequestValues>({
    resolver: zodResolver(indexRequestSchema),
  });

  const onSubmit = async (data: IndexRequestValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/indexing/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Indexing request submitted!");
        setCompletedSteps((prev) => [...prev, 1]);
        setShowIndexRequestForm(false);

        const { indexRequest } = await response.json();
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            indexRequests: [...prevUser.indexRequests, indexRequest],
          };
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData?.error || "Something went wrong while submitting.");
      }
    } catch (error) {
      toast.error("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <DialogHeader>
          <DialogTitle className={`text-2xl font-semibold ${montserrat}`}>Configure Indexing</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground mb-6">Specify what data you want to index on Solana.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Environment</Label>
            <Select onValueChange={(value) => setValue("cluster", value as Cluster)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose environment" />
              </SelectTrigger>
              <SelectContent>
                {solanaEnvironments.map((env) => (
                  <SelectItem key={env.id} value={env.id}>{env.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Database</Label>
            <Select onValueChange={(value) => setValue("databaseId", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a database" />
              </SelectTrigger>
              <SelectContent>
                {databases.length > 0 && databases.map((db) => (
                  <SelectItem key={db.id} value={db.id}>{db.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select onValueChange={(value) => setValue("categoryId", value as IndexCategory)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {solanaIndexCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Index Type</Label>
            <Select onValueChange={(value) => setValue("indexType", value as IndexType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose an index type" />
              </SelectTrigger>
              <SelectContent>
                {indexTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Target Address</Label>
            <Input {...register("targetAddr")} placeholder="Enter target address" className="w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Frequency</Label>
            <Select onValueChange={(value) => setValue("frequency", value as Frequency)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.id} value={freq.id}>{freq.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </motion.div>
    </DialogContent>
  );
}