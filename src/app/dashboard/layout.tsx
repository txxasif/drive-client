import { Icon } from "../../components/elements/Icon";
import { ThemeToggleZustand } from "../../components/elements/ThemeToggleZustand";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <header className="px-6 py-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-surface transition-colors">
        <div className="flex items-center space-x-2">
          <Icon name="logo" size="lg" className="text-primary" />
          <h1 className="font-semibold text-xl">FileDrive</h1>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggleZustand />
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-700 dark:text-gray-300">
            <Icon name="bell" size="sm" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface-light text-gray-700 dark:text-gray-300">
            <Icon name="settings" size="sm" />
          </button>
          <button className="p-1 rounded-full bg-gray-200 dark:bg-dark-surface-light">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-sm font-medium">AS</span>
            </div>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
