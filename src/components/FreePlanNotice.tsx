import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function FreePlanLimitNotice() {
  return (
    <Alert className="border border-border bg-muted/40 text-muted-foreground">
      <Info className="h-4 w-4" />
      <AlertTitle className="text-sm font-medium text-yellow-500 dark:text-yellow-400">
        Free Plan Limit
      </AlertTitle>
      <AlertDescription className="text-sm">
        You can only create one database or index on the free plan. Upgrade your plan to unlock more features.
      </AlertDescription>
    </Alert>
  )
}
