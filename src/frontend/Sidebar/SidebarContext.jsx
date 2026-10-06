import { createContext, useContext, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider( {children} ){
    const [isOpen, setIsOpen] = useState(false);;

    function toggleSidebar(){
        setIsOpen(prev => !prev)
    }

    return(
        <SidebarContext.Provider value = {{isOpen, toggleSidebar}}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar(){
    return useContext(SidebarContext);
}