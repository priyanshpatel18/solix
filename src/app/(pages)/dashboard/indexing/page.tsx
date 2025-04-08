"use client";

import { ContextIndex, User, useUserContext } from "@/components/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Pencil, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import FreePlanLimitNotice from "@/components/FreePlanNotice";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import IndexRequestForm from "@/components/forms/IndexSettingsForm";
import { toast } from "sonner";
import { Status } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.1,
    },
  }),
};

export default function IndexingPage() {
  const { user, setUser } = useUserContext();
  const [showDialog, setShowDialog] = useState(false);
  const [groupedIndexes, setGroupedIndexes] = useState<Record<string, ContextIndex[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.indexSettings?.length) {
      const grouped: Record<string, ContextIndex[]> = {};

      user.indexSettings.forEach((index) => {
        const dbId = index.database.id;
        if (!grouped[dbId]) grouped[dbId] = [];
        grouped[dbId].push(index);
      });

      setGroupedIndexes(grouped);
    }
  }, [user]);

  async function startIndexing(databaseId: string) {
    try {
      if (!databaseId) {
        return toast.error("Please select a database.");
      }

      setIsLoading(true);
      const response = await fetch("/api/indexing/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ databaseId }),
      });

      if (!response.ok) {
        return toast.error("Failed to start indexing.");
      }

      const { message } = await response.json();
      setUser((prevUser) => {
        if (!prevUser) return prevUser;

        const updatedIndexSettings = prevUser.indexSettings.map((index) => {
          if (index.database.id === databaseId) {
            return {
              ...index,
              status: Status.IN_PROGRESS,
            };
          }
          return index;
        });

        return {
          ...prevUser,
          indexSettings: updatedIndexSettings,
        };
      })
      toast.success(message);
    } catch (error) {
      console.error("❌ Error starting indexing:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <motion.div
        className="max-w-5xl mx-auto px-4 py-10 space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.4 } }}
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Indexing</h1>
          <p className="text-muted-foreground">
            Manage your indexes by database.
          </p>
        </div>

        {user?.plan !== "PRO" && Object.values(groupedIndexes).flat().length > 0 && (
          <FreePlanLimitNotice />
        )}

        <div className="flex justify-end">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <DialogTrigger asChild>
              <Button
                className="cursor-pointer"
                disabled={
                  user?.plan !== "PRO" &&
                  Object.values(groupedIndexes).flat().length >= 1
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                New Index
              </Button>
            </DialogTrigger>
          </motion.div>
        </div>

        {(user?.databases.length ?? 0) > 0 ? (
          user?.databases.map((db, i) => (
            <motion.div
              key={db.id}
              custom={i}
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{db.name}</CardTitle>
                    <CardDescription>
                      {db.host}:{db.port} • {db.dbName}
                    </CardDescription>
                  </div>
                  {user?.indexSettings.some(
                    (index) => index.database.id === db.id && index.status === "IN_PROGRESS"
                  ) ? (
                    <div className="flex items-center select-none">
                      <Badge className="px-2 py-1 mr-3 text-xs rounded-full bg-green-100 text-green-800 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" /> System Operational
                      </Badge>
                    </div>
                  ) : (
                    <Button
                      className="cursor-pointer"
                      disabled={isLoading}
                      onClick={async () => await startIndexing(db.id)}
                    >
                      Start Indexing
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {groupedIndexes[db.id]?.length ? (
                    groupedIndexes[db.id].map((index) => (
                      <div
                        key={index.id}
                        className="border rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium">{index.targetAddr}</p>
                          <p className="text-sm text-muted-foreground">
                            Type: {index.indexType} • Status: {index.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last Updated:{" "}
                            {format(new Date(index.updatedAt), "dd MMM yyyy, hh:mm a")}
                          </p>
                        </div>
                        <motion.div
                          className="flex gap-2 justify-end"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button size="icon" variant="outline" className="cursor-pointer">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button size="icon" variant="destructive" className="cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No indexes for this database.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-sm text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          >
            You don't have any databases or indexes set up yet.
          </motion.p>
        )}
      </motion.div>

      <DialogContent>
        <IndexRequestForm
          setShowIndexRequestForm={setShowDialog}
          databases={user?.databases || []}
          setUser={setUser}
        />
      </DialogContent>
    </Dialog >
  );
}
