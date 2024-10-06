import { createContext, useContext } from "react";

interface SidebarContextProps {
  isPreview: boolean;
}

const SidebarContext = createContext<SidebarContextProps>({ isPreview: false });

export const useSidebarContext = () => useContext(SidebarContext);

export default SidebarContext;
