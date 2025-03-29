import { cn } from "@/lib/utils";
import { Github } from "lucide-react";
import Link from "next/link";

export default function Footer({ }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bottom-0 left-0 w-full bg-background border-t py-3 md:py-5 z-50 h-16">
      <div className="flex items-center justify-between space-y-4 md:space-y-0 px-10">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <span>© {currentYear} SolixDB</span>
        </div>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link
            href="https://x.com/priyansh_ptl18"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
              fill="currentColor"
            >
              <title>X</title>
              <path
                d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
              />
            </svg>
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="https://github.com/priyanshpatel18/solixdb"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("hover:text-foreground transition-colors")}
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};