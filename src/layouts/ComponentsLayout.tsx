// src/layouts/ComponentsLayout.tsx
import { Outlet } from 'react-router-dom'

const ComponentsLayout = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  )
}

export default ComponentsLayout
