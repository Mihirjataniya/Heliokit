import React, { useState } from "react"
import {
    Home, Search, MessageCircle, Bell, Heart,
    Grid3X3, User, Settings
} from "lucide-react"
import { GlossyDock } from "./GlossyDock" // Curly braces for named export

export default function DockDemo() {
    const [activeId, setActiveId] = useState("home")
    const dockData = [
        { id: "home", icon: Home, label: "Home", onClick: () => console.log("/home") },
        { id: "search", icon: Search, label: "Search", onClick: () => console.log("Search clicked!") },
        { id: "messages", icon: MessageCircle, label: "Messages", onClick: () => console.log("Opening chat UI...") },
        { id: "notifications", icon: Bell, label: "Notifications", onClick: () => console.log("🔔 You have new notifications.") },
        { id: "favorites", icon: Heart, label: "Favorites", onClick: () => console.log("/favorites") },
        { id: "apps", icon: Grid3X3, label: "Apps", onClick: () => console.log("Launching app tray...") },
        { id: "profile", icon: User, label: "Profile", onClick: () => console.log("/profile") },
        { id: "settings", icon: Settings, label: "Settings", onClick: () => console.log("Opening settings...") }
    ]
    return (
        <div className="bg-black text-white flex flex-col items-center justify-end pb-10">
            <GlossyDock
                accentColor="#7bfc03"
                activeId={activeId}
                onSelect={(id) => setActiveId(id)}
                dockItems={dockData}
            />
        </div>
    )
}
