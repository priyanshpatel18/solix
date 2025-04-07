"use client";

import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { montserrat } from "@/fonts/fonts";
import { indexRequestSchema } from "@/schema/zod";
import { TRANSFER } from "@/types/params";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cluster, IndexParams, IndexType } from "@prisma/client";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { User } from "../UserContext";

const solanaIndexCategories = [
  { id: TRANSFER as IndexParams, name: "Transfer" },
  // { id: "DEPOSIT" as IndexParams, name: "Deposit" },
  // { id: "WITHDRAW" as IndexParams, name: "Withdraw" },
  // { id: "NFT_SALE" as IndexParams, name: "NFT Sale" },
  // { id: "NFT_MINT" as IndexParams, name: "NFT Mint" },
  // { id: "SWAP" as IndexParams, name: "Swap" },
  // { id: "TOKEN_MINT" as IndexParams, name: "Token Mint" },
  // { id: "LOAN" as IndexParams, name: "Loan" },
  // { id: "STAKE_TOKEN" as IndexParams, name: "Stake Token" },
  // { id: "BURN" as IndexParams, name: "Burn" },
];

const indexTypes = [
  { id: "TRANSACTIONS" as IndexType, name: "Transactions" },
  // { id: "TOKEN_ACCOUNTS" as IndexType, name: "Token Accounts" },
  // { id: "PROGRAM_LOGS" as IndexType, name: "Program Logs" },
  // { id: "NFTS" as IndexType, name: "NFTs" },
];

const cluster = [
  { id: "DEVNET" as Cluster, name: "Devnet" },
  { id: "MAINNET" as Cluster, name: "Mainnet" },
]

type IndexRequestValues = z.infer<typeof indexRequestSchema>;

interface IndexRequestFormProps {
  setShowIndexRequestForm: Dispatch<SetStateAction<boolean>>;
  setCompletedSteps: Dispatch<SetStateAction<number[]>>;
  databases: { id: string; name: string }[];
  setUser: Dispatch<SetStateAction<User | null>>;
  setDatabaseId: Dispatch<SetStateAction<string>>;
}

export default function IndexRequestForm({ setShowIndexRequestForm, setCompletedSteps, databases, setUser, setDatabaseId }: IndexRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IndexRequestValues>({
    resolver: zodResolver(indexRequestSchema),
  });

  const onSubmit = async (data: IndexRequestValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/indexing/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Indexing request submitted!");
        setCompletedSteps((prev) => [...prev, 1]);
        setShowIndexRequestForm(false);
        setDatabaseId(data.databaseId);

        const { indexSettings } = await response.json();
        setUser((prevUser) => {
          if (!prevUser) return prevUser;
          return {
            ...prevUser,
            indexSettings: [...prevUser.indexSettings, indexSettings],
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <DialogHeader>
        <DialogTitle className={`text-2xl font-semibold ${montserrat}`}>Configure Indexing</DialogTitle>
      </DialogHeader>
      <p className="text-muted-foreground mb-6">Specify what data you want to index on Solana.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Database</Label>
          <Select onValueChange={(value) => setValue("databaseId", value)}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Choose a database" />
            </SelectTrigger>
            <SelectContent>
              {databases.length > 0 && databases.map((db) => (
                <SelectItem className="cursor-pointer" key={db.id} value={db.id}>{db.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Category</Label>
          <Select onValueChange={(value) => setValue("categoryId", value as IndexParams)}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {solanaIndexCategories.map((cat) => (
                <SelectItem className="cursor-pointer" key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Index Type</Label>
          <Select onValueChange={(value) => setValue("indexType", value as IndexType)}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Choose an index type" />
            </SelectTrigger>
            <SelectContent>
              {indexTypes.map((type) => (
                <SelectItem className="cursor-pointer" key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Cluster</Label>
          <Select onValueChange={(value) => setValue("cluster", value as Cluster)}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue placeholder="Choose a cluster" />
            </SelectTrigger>
            <SelectContent>
              {cluster.map((type) => (
                <SelectItem className="cursor-pointer" key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 md:col-span-2">
          <Label>Target Address</Label>
          <Input {...register("targetAddr")} placeholder="Enter target address" className="w-full" />
        </div>

        <div className="col-span-1 md:col-span-2">
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}