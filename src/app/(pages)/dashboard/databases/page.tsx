"use client";

import FreePlanLimitNotice from "@/components/FreePlanNotice";
import { ContextDatabase, User, useUserContext } from "@/components/UserContext";
import StoreDatabaseForm from "@/components/forms/StoreDatabaseForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Layers, Pencil, Plus, Server, Trash2, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

const buttonHover = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

export default function DatabasesPage() {
  const { user, setUser } = useUserContext();
  const [showDialog, setShowDialog] = useState(false);
  const [databases, setDatabases] = useState<ContextDatabase[]>([]);

  useEffect(() => {
    if (user) {
      setDatabases(user.databases);
    }
  }, [user]);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <motion.div
        className="max-w-5xl mx-auto px-4 py-10 space-y-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="space-y-1">
          <motion.h1
            className="text-3xl font-bold tracking-tight"
            variants={itemVariants}
          >
            Databases
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            variants={itemVariants}
          >
            View and manage your connected databases.
          </motion.p>
        </div>

        {user?.plan !== "PRO" && databases.length >= 1 && (
          <motion.div variants={itemVariants}>
            <FreePlanLimitNotice />
          </motion.div>
        )}

        <motion.div
          className="flex justify-end"
          variants={itemVariants}
        >
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={buttonHover}
          >
            <Button
              className="cursor-pointer"
              onClick={() => setShowDialog(true)}
              disabled={user?.plan !== "PRO" && databases.length >= 1}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Database
            </Button>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {databases.length > 0 ? (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {databases.map((db, index) => (
                <motion.div
                  key={db.id}
                  variants={itemVariants}
                  custom={index}
                  layout
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <motion.div
                              variants={iconVariants}
                              className="mr-2"
                            >
                              <Database className="h-5 w-5 text-primary" />
                            </motion.div>
                            <CardTitle className="text-lg">{db.name}</CardTitle>
                          </div>
                          <CardDescription>
                            Created on {format(new Date(db.createdAt), "dd MMM yyyy")}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="backdrop-blur-sm">{db.dbName}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <motion.div
                          className="flex items-center bg-muted/40 p-3 rounded-md"
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                        >
                          <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <span className="block font-medium text-foreground">Host</span>
                            <span className="text-muted-foreground">{db.host}:{db.port}</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex items-center bg-muted/40 p-3 rounded-md"
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                        >
                          <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <span className="block font-medium text-foreground">Username</span>
                            <span className="text-muted-foreground">{db.username}</span>
                          </div>
                        </motion.div>

                        <motion.div
                          className="flex items-center bg-muted/40 p-3 rounded-md"
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.06)" }}
                        >
                          <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <span className="block font-medium text-foreground">Indexes</span>
                            <span className="text-muted-foreground">{db.indexSettings?.length ?? 0}</span>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        className="flex gap-2 justify-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonHover}
                        >
                          <Button size="icon" className="cursor-pointer" variant="outline">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover="hover"
                          whileTap="tap"
                          variants={buttonHover}
                        >
                          <Button size="icon" className="cursor-pointer" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="my-20 text-center space-y-4"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={iconVariants}
                className="mx-auto"
              >
                <Database className="mx-auto h-16 w-16 text-muted-foreground/50" />
              </motion.div>
              <motion.p
                className="text-lg font-medium text-muted-foreground"
                variants={itemVariants}
              >
                No databases connected yet.
              </motion.p>
              <motion.div
                className="inline-block"
                whileHover="hover"
                whileTap="tap"
                variants={buttonHover}
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Your First Database
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <DialogContent>
        <StoreDatabaseForm
          setShowStoreDatabaseForm={setShowDialog}
          setUser={setUser}
        />
      </DialogContent>
    </Dialog>
  );
}