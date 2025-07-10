import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { AlertTriangle, Home } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

interface WorkspaceNotFoundProps {
  workspaceId?: string;
  title?: string;
  description?: string;
}

export const WorkspaceNotFound = ({
  workspaceId,
  title = "Workspace not found",
  description = "The workspace you're looking for doesn't exist or you don't have access to it.",
}: WorkspaceNotFoundProps) => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {description}
              {workspaceId && (
                <span className="block mt-2 font-mono text-sm text-muted-foreground">
                  ID: {workspaceId}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline">
                <Link to="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link to="/workspaces">View All Workspaces</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Or{" "}
              <button
                onClick={() => setIsCreatingWorkspace(true)}
                className="text-primary underline hover:no-underline"
              >
                create a new workspace
              </button>
            </p>
          </CardContent>
        </Card>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};
