"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/breadcrumbs.css";

const Breadcrumbs = () => {
  const pathname = usePathname();

  // Split the pathname into segments and filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <nav className="breadcrumbs">
      <div className="breadcrumb-item">
        <a className="root">Gestión del sistema</a>
        <img src="/icons/chevron-right.svg" className="w-6 h-6" />
      </div>
      {pathSegments.map((segment, index) => {
        // Build the URL progressively for each breadcrumb
        const href = "/" + pathSegments.slice(0, index + 1).join("/");

        // Capitalize each breadcrumb segment
        const segmentName = segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <div className="breadcrumb-item" key={href}>
            {index === pathSegments.length - 1 ? (
              <a className="active">{segmentName}</a>
            ) : (
              <Link href={href}>{segmentName}</Link>
            )}

            {/* Render icon between breadcrumb links except the last one */}
            {index < pathSegments.length - 1 && (
              <img src="/icons/chevron-right.svg" className="w-6 h-6" />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
