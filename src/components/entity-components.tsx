"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { MoreVertical, Search, Loader2, AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ── Header ─────────────────────────────────────────────

export function EntityHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

// ── Container ──────────────────────────────────────────

export function EntityContainer({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}

// ── Search ─────────────────────────────────────────────

export function EntitySearch({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative max-w-sm">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────

export function EntityPagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (next: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        Page {page} of {totalPages} · {totalCount} total
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ── Item ───────────────────────────────────────────────

export function EntityItem({
  title,
  subtitle,
  href,
  onDelete,
  deleteLabel = "Delete",
  deleteConfirmTitle = "Are you sure?",
  deleteConfirmDescription = "This action cannot be undone.",
}: {
  title: string;
  subtitle?: string;
  href: string;
  onDelete?: () => void | Promise<void>;
  deleteLabel?: string;
  deleteConfirmTitle?: string;
  deleteConfirmDescription?: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <Card className="hover:bg-accent/30 transition-colors">
      <CardContent className="flex items-center justify-between p-4">
        <Link href={href} className="min-w-0 flex-1">
          <p className="truncate font-medium">{title}</p>
          {subtitle ? (
            <p className="text-muted-foreground truncate text-xs">{subtitle}</p>
          ) : null}
        </Link>
        {onDelete ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => setConfirmOpen(true)}
                >
                  {deleteLabel}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{deleteConfirmTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {deleteConfirmDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete()}>
                    {deleteLabel}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

// ── State views ────────────────────────────────────────

export function LoadingView({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="text-muted-foreground flex items-center justify-center gap-2 p-12 text-sm">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorView({ message }: { message: string }) {
  return (
    <div className="text-destructive flex items-center justify-center gap-2 p-12 text-sm">
      <AlertCircle className="h-4 w-4" />
      {message}
    </div>
  );
}

export function EmptyView({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed p-12 text-center">
      <Inbox className="text-muted-foreground h-8 w-8" />
      <div>
        <p className="font-medium">{title}</p>
        {description ? (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
