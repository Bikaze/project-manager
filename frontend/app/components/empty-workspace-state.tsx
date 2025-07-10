import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspace } from "@/components/workspace/create-workspace";
import { Building2, PlusCircle, Sparkles } from "lucide-react";
import { useState } from "react";

interface EmptyWorkspaceStateProps {
  title?: string;
  description?: string;
}

export const EmptyWorkspaceState = ({
  title = "Welcome to your dashboard!",
  description = "You don't have any workspaces yet. Create your first workspace to get started with organizing your projects and tasks.",
}: EmptyWorkspaceStateProps) => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-2xl w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Create Workspace</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your team workspace
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <PlusCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium">Add Projects</h3>
                <p className="text-sm text-muted-foreground">
                  Organize work into projects
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="mx-auto w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium">Manage Tasks</h3>
                <p className="text-sm text-muted-foreground">
                  Track progress and collaborate
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsCreatingWorkspace(true)}
              size="lg"
              className="mt-6"
            >
              <PlusCircle className="size-4 mr-2" />
              Create Your First Workspace
            </Button>
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
