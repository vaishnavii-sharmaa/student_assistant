import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useSidebar } from '../context/useSidebar';

export default function Layout({ children }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <MobileNav />
      <main
        className={`min-h-screen pb-20 md:pb-0 transition-all duration-300 ease-in-out
                    ${collapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}
      >
        <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
