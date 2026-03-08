import { Home, Map, Trophy, Award, Gift, Users, DollarSign, ClipboardList, Bell, BarChart3 } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Overview', url: '/admin', icon: Home },
  { title: 'Game Map', url: '/admin/map', icon: Map },
  { title: 'Rankings', url: '/admin/ranking', icon: Trophy },
  { title: 'Employee of Month', url: '/admin/eom', icon: Award },
  { title: 'Rewards', url: '/admin/rewards', icon: Gift },
  { title: 'Salaries', url: '/admin/salaries', icon: DollarSign },
  { title: 'Tasks', url: '/admin/tasks', icon: ClipboardList },
  { title: 'Reminders', url: '/admin/reminders', icon: Bell },
  { title: 'Employees', url: '/admin/employees', icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`px-4 py-5 border-b border-sidebar-border ${collapsed ? 'px-2' : ''}`}>
          {!collapsed ? (
            <div>
              <h1 className="text-lg font-bold font-display text-gradient-primary">Dwamee Game HR</h1>
              <p className="text-[10px] text-muted-foreground">Manager Dashboard</p>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mx-auto">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin'}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
