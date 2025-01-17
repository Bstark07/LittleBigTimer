import React from "react"
import cn from "classnames"

interface DrawerProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  side?: "left" | "right"
  isDarkMode: boolean
  title: string
}

export const Drawer: React.FC<DrawerProps> = ({ children, isOpen, onClose, side = "right", isDarkMode, title }) => {
  return (
    <div
      className={cn(
        "fixed top-0 bottom-0 z-50 w-64 p-4 transition-transform duration-300 ease-in-out",
        isDarkMode 
          ? "bg-black text-white border-l border-white" 
          : "bg-white text-black",
        side === "left" ? "left-0" : "right-0",
        isOpen ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      {children}
    </div>
  )
}

export default Drawer

