"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import React from "react";
import { Edit3Icon, MenuIcon } from "lucide-react";
import { Button } from "./button";
import { topicQuestions } from "@/constants/topics";

interface AppSidebarProps {
  onSelectTopic: (id: string) => void;
  onNewChat: () => void; // Add a new prop for the new chat action
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  onSelectTopic,
  onNewChat,
}) => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <>
      <Sidebar collapsible="icon" className="w-72 z-30 border-r bg-muted/40">
        <Button
          className="h-8 w-8 text-black ml-3"
          size="icon"
          variant="ghost"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </Button>
        <SidebarContent>
          {/* New Chat Section */}
          <SidebarGroup className="mt-6">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={onNewChat} // Call onNewChat when clicked
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all "
                    >
                      {open && (
                        <span className="truncate font-semibold mr-1">
                          New Chat
                        </span>
                      )}
                      <Edit3Icon className="w-5 h-5" />
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* End New Chat Section */}

          <SidebarGroup>
            <SidebarGroupContent className="mt-6">
              {open && (
                <span className="text-sm font-semibold px-3 mb-2 block">
                  Topik Populer
                </span>
              )}
              <SidebarMenu>
                {topicQuestions.map((topic) => {
                  return (
                    <SidebarMenuItem key={topic.id}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => onSelectTopic(topic.label)}
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-muted text-muted-foreground"`}
                        >
                          <div
                            className={`p-1 rounded-full ${topic.color} text-white`}
                          >
                            <topic.icon className="w-4 h-4" />
                          </div>
                          <span className="truncate">{topic.label}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
              {open && (
                <div className="text-xs text-muted-foreground text-center py-4">
                  Taxnesa AI &copy; 2025
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
};
