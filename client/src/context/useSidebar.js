import { useContext } from 'react';
import { SidebarContext } from './sidebarContextObject';

// Separated into its own file to satisfy react-refresh/only-export-components
export function useSidebar() {
  return useContext(SidebarContext);
}
