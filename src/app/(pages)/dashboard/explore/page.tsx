"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUserContext } from "@/components/UserContext";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ROWS_PER_PAGE = 10;

export default function TransactionsPage() {
  const { userData } = useUserContext();
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDatabase, setSelectedDatabase] = useState<string>(
    userData ? Object.keys(userData)[0] || "" : ""
  );

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDatabaseChange = (value: string) => {
    setSelectedDatabase(value);
  };

  // Paginate the data for the selected database
  const selectedData = userData ? userData[selectedDatabase] || [] : [];
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedData = selectedData.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const totalPages = Math.ceil(selectedData.length / ROWS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-10 space-y-8 flex flex-col"
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Explore your database
          </h1>
          <p className="text-muted-foreground">
            Overview of all activities recorded in your selected database.
          </p>
        </div>
        <Select value={selectedDatabase} onValueChange={handleDatabaseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a database" />
          </SelectTrigger>
          <SelectContent>
            {userData && Object.keys(userData).map((db) => (
              <SelectItem key={db} value={db} className="cursor-pointer">
                {db}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <ScrollArea className="rounded-md border p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Signature</TableHead>
                <TableHead>Fee Payer</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((tx: any) => (
                <>
                  <TableRow key={tx.id}>
                    <TableCell className="max-w-[250px] truncate">{tx.description}</TableCell>
                    <TableCell>{tx.slot.toString()}</TableCell>
                    <TableCell>{tx.fee}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{tx.signature}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{tx.fee_payer}</TableCell>
                    <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRow(tx.id)}
                      >
                        {expandedRows[tx.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {expandedRows[tx.id] && (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td colSpan={7} className="p-4">
                        <motion.div
                          className="rounded-md border p-4 shadow-sm bg-muted/30 space-y-4"
                          layout
                        >
                          <div>
                            <h4 className="text-sm font-semibold mb-1">Accounts</h4>
                            <div className="space-y-2">
                              {tx.account_data?.map((acc: any, i: number) => (
                                <div key={i} className="text-sm rounded px-2 py-1 bg-muted">
                                  <span className="font-medium">{acc.account}</span> — Balance Change:{" "}
                                  <span className="text-muted-foreground">{acc.nativeBalanceChange}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold mb-1">Instructions</h4>
                            <div className="space-y-2">
                              {tx.instructions?.map((inst: any, i: number) => (
                                <div key={i} className="text-sm rounded px-2 py-1 bg-muted">
                                  Program:{" "}
                                  <span className="font-medium">{inst.programId}</span> — Data:{" "}
                                  <code className="bg-background px-1 py-0.5 rounded text-xs">
                                    {inst.data}
                                  </code>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </motion.tr>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="flex justify-between items-center py-4 select-none">
        <Button
          variant="ghost"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="ghost"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
}
