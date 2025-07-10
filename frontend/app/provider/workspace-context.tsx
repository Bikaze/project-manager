import type { Workspace } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";

interface WorkspaceContextType {
  selectedWorkspace: Workspace | null;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  workspaces: Workspace[];
  isLoading: boolean;
  hasWorkspaces: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
};

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null
  );
  const navigate = useNavigate();
  const location = useLocation();

  const { data: workspaces = [], isLoading } = useGetWorkspacesQuery() as {
    data: Workspace[];
    isLoading: boolean;
  };

  const hasWorkspaces = workspaces.length > 0;
  const workspaceIdFromUrl = searchParams.get("workspaceId");

  // Auto-select first workspace if none is selected and workspaces exist
  useEffect(() => {
    if (!isLoading) {
      if (!hasWorkspaces && location.pathname === "/dashboard") {
        // Redirect new users to onboarding
        navigate("/onboarding");
        return;
      }

      if (hasWorkspaces && !selectedWorkspace) {
        if (workspaceIdFromUrl) {
          // Try to find workspace from URL
          const workspaceFromUrl = workspaces.find(
            (ws) => ws._id === workspaceIdFromUrl
          );
          if (workspaceFromUrl) {
            setSelectedWorkspace(workspaceFromUrl);
          } else {
            // URL workspace not found, select first one
            setSelectedWorkspace(workspaces[0]);
            setSearchParams((prev) => {
              prev.set("workspaceId", workspaces[0]._id);
              return prev;
            });
          }
        } else {
          // No workspace in URL, select first one
          setSelectedWorkspace(workspaces[0]);
          setSearchParams((prev) => {
            prev.set("workspaceId", workspaces[0]._id);
            return prev;
          });
        }
      }
    }
  }, [
    workspaces,
    isLoading,
    selectedWorkspace,
    workspaceIdFromUrl,
    hasWorkspaces,
    setSearchParams,
    navigate,
    location,
  ]);

  // Update URL when workspace changes
  const handleSetSelectedWorkspace = (workspace: Workspace | null) => {
    setSelectedWorkspace(workspace);
    if (workspace) {
      setSearchParams((prev) => {
        prev.set("workspaceId", workspace._id);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("workspaceId");
        return prev;
      });
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspace,
        setSelectedWorkspace: handleSetSelectedWorkspace,
        workspaces,
        isLoading,
        hasWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
