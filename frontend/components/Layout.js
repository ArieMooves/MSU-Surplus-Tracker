"use client";
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ScanBarcode, 
  BarChart3, 
  Settings, 
  LogOut,
  PlusCircle
} from 'lucide-react';

export default function Layout({ children }) {
  const menuItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={20}/> },
    { name: 'Inventory', href: '/inventory', icon: <ClipboardList size={20}/> },
    { name: 'Add Asset', href: '/add', icon: <PlusCircle size={20}/> },
    { name: 'Scanner', href: '/scanner', icon: <ScanBarcode size={20}/> },
    { name: 'Reports', href: '/reports', icon: <BarChart3 size={20}/> },
    { name: 'Settings', href: '/settings', icon: <Settings size={20}/> },
  ];

  return (
    <div className="flex h-screen bg-stone-50"> {/* Warmer background for professional look */}
      {/* SIDEBAR - Branded Maroon */}
      <aside className="w-64 bg-brand-maroon text-white flex flex-col shadow-2xl">
        <div className="p-6 text-brand-gold text-2xl font-black border-b border-brand-dark italic tracking-tighter">
          MSU SURPLUS
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-brand-dark hover:text-brand-gold transition-all group"
            >
              <span className="text-brand-gold/60 group-hover:text-brand-gold transition-colors">
                {item.icon}
              </span>
              <span className="font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="p-4 border-t border-brand-dark space-y-2">
          <button 
            onClick={() => console.log("Logging out...")}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-lg hover:bg-black/20 hover:text-brand-gold transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
          <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-brand-gold/50 font-bold">
            Logged in as Admin
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER - White with Gold Border Accent */}
        <header className="h-16 bg-white border-b-4 border-brand-gold flex items-center px-8 justify-between shadow-sm">
          <h2 className="font-bold text-brand-maroon uppercase tracking-tight">System Overview</h2>
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold text-brand-maroon bg-brand-gold/20 px-3 py-1 rounded-full uppercase tracking-wider">
                April 2026
             </span>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
