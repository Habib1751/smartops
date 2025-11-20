// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  TrendingUp,
  Briefcase,
  Zap,
  Truck,
  FileText,
  X,
} from 'lucide-react';

interface SidebarProps {
  unreadCount?: number;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ unreadCount = 5, mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/dashboard/leads', icon: Briefcase },
    { name: 'Events', href: '/dashboard/events', icon: ShoppingCart },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Equipment', href: '/dashboard/equipment', icon: Package },
    { name: 'Technicians', href: '/dashboard/technicians', icon: Zap },
    { name: 'Vehicles', href: '/dashboard/vehicles', icon: Truck },
    { name: 'Quotes', href: '/dashboard/quotes', icon: FileText },
    { name: 'Reports', href: '/dashboard/reports', icon: TrendingUp },
  ];

  const renderNav = (
    <nav className="flex-1 overflow-y-auto py-4">
      <div className="px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-lg
                transition-colors duration-150
                ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="relative w-64 h-full bg-white border-r border-gray-200">
            <div className="h-16 flex items-center px-4 border-b">
              <h1 className="text-lg font-bold">SmartOps</h1>
              <button onClick={onClose} className="ml-auto p-2 text-gray-600">
                <X />
              </button>
            </div>

            {/* WhatsApp Status */}
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-green-700">SmartOps Ready</span>
                </div>
              </div>
            </div>

            {renderNav}

            <div className="p-4 border-t border-gray-200">
              <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings size={20} />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col h-screen md:fixed md:left-0 md:top-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">SmartOps</h1>
        </div>

        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">SmartOps Ready</span>
            </div>
          </div>
        </div>

        {renderNav}

        <div className="p-4 border-t border-gray-200">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}
