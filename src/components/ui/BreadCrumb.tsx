import { useLocation, Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Fragment } from "react"

export function Breadcrumb() {
  const location = useLocation()
  const segments = location.pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1

    return {
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      href,
      isLast,
    }
  })

  return (
    <nav className="text-sm font-navbar flex items-center gap-1 text-text-primary" aria-label="breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <Fragment key={crumb.href}>
          {index > 0 && <ChevronRight size={16} className="text-gray-400 mx-1" />}
          {crumb.isLast ? (
            <span className="cursor-pointer text-text-primary">{crumb.name}</span>
          ) : (
            <Link to={crumb.href} className="text-text-primary hover:underline">
              {crumb.name}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
