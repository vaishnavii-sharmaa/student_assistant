import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <MobileNav />
      <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
