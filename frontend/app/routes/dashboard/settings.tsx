import { EmptyWorkspaceState } from "@/components/empty-workspace-state";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/provider/workspace-context";
import { useAuth } from "@/provider/auth-context";
import {
  useGetWorkspaceDetailsQuery,
  useGetWorkspaceMembersQuery,
  useUpdateWorkspaceMutation,
  useTransferWorkspaceOwnershipMutation,
  useDeleteWorkspaceMutation,
} from "@/hooks/use-workspace";
import { Bell, Palette, Shield, User, Trash2, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

const SettingsPage = () => {
  const {
    selectedWorkspace,
    hasWorkspaces,
    isLoading: workspacesLoading,
  } = useWorkspace();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Local state for form data
  const [workspaceForm, setWorkspaceForm] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  });
  const [selectedNewOwner, setSelectedNewOwner] = useState("");

  // Fetch workspace details and members
  const {
    data: workspaceDetails,
    isLoading: detailsLoading,
    refetch: refetchDetails,
  } = useGetWorkspaceDetailsQuery(selectedWorkspace?._id || null);
  const { data: members, isLoading: membersLoading } =
    useGetWorkspaceMembersQuery(selectedWorkspace?._id || null);

  // Mutations
  const updateWorkspaceMutation = useUpdateWorkspaceMutation();
  const transferOwnershipMutation = useTransferWorkspaceOwnershipMutation();
  const deleteWorkspaceMutation = useDeleteWorkspaceMutation();

  // Update form when workspace details load
  useEffect(() => {
    if (workspaceDetails) {
      setWorkspaceForm({
        name: workspaceDetails.name || "",
        description: workspaceDetails.description || "",
        color: workspaceDetails.color || "#3b82f6",
      });
    }
  }, [workspaceDetails]);

  const handleUpdateWorkspace = async () => {
    if (!selectedWorkspace?._id) return;

    try {
      await updateWorkspaceMutation.mutateAsync({
        workspaceId: selectedWorkspace._id,
        ...workspaceForm,
      });
      await refetchDetails();
      // Show success message
      alert("Workspace updated successfully!");
    } catch (error) {
      alert("Failed to update workspace");
    }
  };

  const handleTransferOwnership = async () => {
    if (!selectedWorkspace?._id || !selectedNewOwner) return;

    const confirmTransfer = window.confirm(
      "Are you sure you want to transfer ownership? This action cannot be undone."
    );

    if (confirmTransfer) {
      try {
        await transferOwnershipMutation.mutateAsync({
          workspaceId: selectedWorkspace._id,
          newOwnerId: selectedNewOwner,
        });
        await refetchDetails();
        alert("Ownership transferred successfully!");
        setSelectedNewOwner("");
      } catch (error) {
        alert("Failed to transfer ownership");
      }
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!selectedWorkspace?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workspace? This action will permanently delete all projects, tasks, and data. This cannot be undone."
    );

    if (confirmDelete) {
      try {
        await deleteWorkspaceMutation.mutateAsync(selectedWorkspace._id);
        navigate("/dashboard");
        alert("Workspace deleted successfully!");
      } catch (error) {
        alert("Failed to delete workspace");
      }
    }
  };

  const isOwner = selectedWorkspace?.owner === user?._id;
  const eligibleNewOwners =
    members?.filter(
      (member: any) => member.user._id !== user?._id && member.role !== "owner"
    ) || [];

  const colorOptions = [
    { value: "#3b82f6", label: "Blue", color: "#3b82f6" },
    { value: "#ef4444", label: "Red", color: "#ef4444" },
    { value: "#10b981", label: "Green", color: "#10b981" },
    { value: "#f59e0b", label: "Orange", color: "#f59e0b" },
    { value: "#8b5cf6", label: "Purple", color: "#8b5cf6" },
    { value: "#06b6d4", label: "Cyan", color: "#06b6d4" },
    { value: "#84cc16", label: "Lime", color: "#84cc16" },
    { value: "#f97316", label: "Orange", color: "#f97316" },
  ];

  if (workspacesLoading || detailsLoading) {
    return <Loader />;
  }

  if (!hasWorkspaces) {
    return (
      <EmptyWorkspaceState
        title="No workspaces found"
        description="You need to create a workspace first before you can access settings."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and workspace preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="workspace">
            <Palette className="w-4 h-4 mr-2" />
            Workspace
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={user?.name || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} readOnly />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Update Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspace" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>
                Configure settings for {selectedWorkspace?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  value={workspaceForm.name}
                  onChange={(e) =>
                    setWorkspaceForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  disabled={!isOwner}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-description">Description</Label>
                <Textarea
                  id="workspace-description"
                  value={workspaceForm.description}
                  onChange={(e) =>
                    setWorkspaceForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  disabled={!isOwner}
                  placeholder="Enter workspace description..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-color">Workspace Color</Label>
                <Select
                  value={workspaceForm.color}
                  onValueChange={(value: string) =>
                    setWorkspaceForm((prev) => ({ ...prev, color: value }))
                  }
                  disabled={!isOwner}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: workspaceForm.color }}
                        />
                        {
                          colorOptions.find(
                            (c) => c.value === workspaceForm.color
                          )?.label
                        }
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.color }}
                          />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isOwner && (
                <>
                  <Separator />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpdateWorkspace}
                      disabled={updateWorkspaceMutation.isPending}
                    >
                      {updateWorkspaceMutation.isPending
                        ? "Updating..."
                        : "Save Changes"}
                    </Button>
                  </div>
                </>
              )}
              {!isOwner && (
                <div className="text-sm text-muted-foreground mt-4">
                  Only workspace owners can modify these settings.
                </div>
              )}
            </CardContent>
          </Card>

          {isOwner && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    Transfer Ownership
                  </CardTitle>
                  <CardDescription>
                    Transfer ownership of this workspace to another member. You
                    will become a regular member.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-owner">Select New Owner</Label>
                    <Select
                      value={selectedNewOwner}
                      onValueChange={setSelectedNewOwner}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a member..." />
                      </SelectTrigger>
                      <SelectContent>
                        {eligibleNewOwners.map((member: any) => (
                          <SelectItem
                            key={member.user._id}
                            value={member.user._id}
                          >
                            {member.user.name} ({member.user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleTransferOwnership}
                      disabled={
                        !selectedNewOwner || transferOwnershipMutation.isPending
                      }
                      variant="outline"
                    >
                      {transferOwnershipMutation.isPending
                        ? "Transferring..."
                        : "Transfer Ownership"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Permanently delete this workspace and all its data. This
                    action cannot be undone.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleDeleteWorkspace}
                    disabled={deleteWorkspaceMutation.isPending}
                    variant="destructive"
                  >
                    {deleteWorkspaceMutation.isPending
                      ? "Deleting..."
                      : "Delete Workspace"}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Notification settings will be available in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Security settings will be available in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
