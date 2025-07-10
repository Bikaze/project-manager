import { EmptyWorkspaceState } from "@/components/empty-workspace-state";
import { Loader } from "@/components/loader";
import { useWorkspace } from "@/provider/workspace-context";

const NewUserOnboarding = () => {
  const { isLoading, hasWorkspaces } = useWorkspace();

  if (isLoading) {
    return <Loader />;
  }

  if (hasWorkspaces) {
    // Redirect to dashboard if user already has workspaces
    window.location.href = "/dashboard";
    return <Loader />;
  }

  return (
    <EmptyWorkspaceState
      title="Welcome to TaskHub!"
      description="Let's get you started by creating your first workspace. A workspace is where you and your team can collaborate on projects and manage tasks."
    />
  );
};

export default NewUserOnboarding;
