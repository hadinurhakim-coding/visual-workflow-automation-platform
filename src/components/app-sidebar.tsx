// src/components/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Workflow, Key, Play } from "lucide-react";

const navItems = [
  { title: "Workflows", url: "/workflows", icon: Workflow },
  { title: "Credentials", url: "/credentials", icon: Key },
  { title: "Executions", url: "/executions", icon: Play },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/workflows" className="flex items-center gap-2 px-2">
          <span className="text-lg font-bold">Nodebase</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => router.push("/login"),
              },
            });
          }}
        >
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}