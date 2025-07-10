import { EmptyWorkspaceState } from "@/components/empty-workspace-state";
import { Loader } from "@/components/loader";
import { NoDataFound } from "@/components/no-data-found";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetWorkspaceArchivedProjectsQuery, useGetWorkspaceArchivedTasksQuery } from "@/hooks/use-workspace";
import { useWorkspace } from "@/provider/workspace-context";
import type { Project, Task } from "@/types";
import { format } from "date-fns";
import { Archive, Calendar, Folder, ListCheck } from "lucide-react";

const ArchivedPage = () => {
  const { selectedWorkspace, hasWorkspaces, isLoading: workspacesLoading } = useWorkspace();

  const { data: archivedProjects, isLoading: projectsLoading } = useGetWorkspaceArchivedProjectsQuery(
    selectedWorkspace?._id || ""
  ) as {
    data: Project[];
    isLoading: boolean;
  };

  const { data: archivedTasks, isLoading: tasksLoading } = useGetWorkspaceArchivedTasksQuery(
    selectedWorkspace?._id || ""
  ) as {
    data: Task[];
    isLoading: boolean;
  };

  if (workspacesLoading || projectsLoading || tasksLoading) {
    return <Loader />;
  }

  if (!hasWorkspaces) {
    return (
      <EmptyWorkspaceState
        title="No workspaces found"
        description="You need to create a workspace first before you can view archived items."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Archived Items</h1>
          <p className="text-muted-foreground mt-1">
            View archived projects and tasks from {selectedWorkspace?.name}
          </p>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">
            <Folder className="w-4 h-4 mr-2" />
            Projects ({archivedProjects?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ListCheck className="w-4 h-4 mr-2" />
            Tasks ({archivedTasks?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {archivedProjects && archivedProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {archivedProjects.map((project) => (
                <ArchivedProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <NoDataFound
              title="No archived projects"
              description="No projects have been archived yet."
              buttonText="View Projects"
              buttonAction={() => window.location.href = "/workspaces"}
            />
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {archivedTasks && archivedTasks.length > 0 ? (
            <div className="grid gap-4">
              {archivedTasks.map((task) => (
                <ArchivedTaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <NoDataFound
              title="No archived tasks"
              description="No tasks have been archived yet."
              buttonText="View Tasks"
              buttonAction={() => window.location.href = "/my-tasks"}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ArchivedProjectCard = ({ project }: { project: Project }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Archive className="w-4 h-4 text-muted-foreground" />
        </div>
        <CardDescription>
          {project.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Archived on {format(new Date(project.updatedAt), "MMM d, yyyy")}
          </div>
          <div className="flex items-center justify-between">
            <span>Status: {project.status}</span>
            <span>Progress: {project.progress}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ArchivedTaskCard = ({ task }: { task: Task }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Archive className="w-4 h-4 text-muted-foreground" />
        </div>
        <CardDescription>
          {task.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Archived on {format(new Date(task.updatedAt), "MMM d, yyyy")}
          </div>
          <div className="flex items-center justify-between">
            <span>Status: {task.status}</span>
            <span>Priority: {task.priority}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArchivedPage;
