import { useCallback, useState } from "react";
import { BreadcrumbItem, FolderItem } from "../types/files";

export function useFileNavigation() {
  const [currentPath, setCurrentPath] = useState("/");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Handle navigation between folders
  const handleNavigate = useCallback((path: string) => {
    setCurrentPath(path);

    // Update breadcrumb
    if (path === "/") {
      setBreadcrumbs([]);
    } else {
      const parts = path.split("/").filter(Boolean);
      const newBreadcrumbs = parts.map((part, index) => {
        const subPath = "/" + parts.slice(0, index + 1).join("/");
        return { name: part, path: subPath };
      });
      setBreadcrumbs(newBreadcrumbs);
    }
  }, []);

  // Handle folder click for navigation
  const handleFolderClick = useCallback(
    (folderId: string, folders: FolderItem[]) => {
      const folder = folders.find((f) => f.id === folderId);
      if (folder) {
        const newPath =
          currentPath === "/"
            ? `/${folder.name}`
            : `${currentPath}/${folder.name}`;
        handleNavigate(newPath);
      }
    },
    [currentPath, handleNavigate]
  );

  return {
    currentPath,
    breadcrumbs,
    handleNavigate,
    handleFolderClick,
  };
}
