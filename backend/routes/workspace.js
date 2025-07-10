import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  acceptGenerateInvite,
  acceptInviteByToken,
  createWorkspace,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaces,
  getWorkspaceStats,
  inviteUserToWorkspace,
  getWorkspaceArchivedProjects,
  getWorkspaceArchivedTasks,
  updateWorkspace,
  transferWorkspaceOwnership,
  deleteWorkspace,
  getWorkspaceMembers,
} from "../controllers/workspace.js";
import {
  inviteMemberSchema,
  tokenSchema,
  workspaceSchema,
} from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { z } from "zod";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: tokenSchema }),
  acceptInviteByToken
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteUserToWorkspace
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ params: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite
);

router.get("/", authMiddleware, getWorkspaces);

router.get("/:workspaceId", authMiddleware, getWorkspaceDetails);
router.put("/:workspaceId", authMiddleware, updateWorkspace);
router.delete("/:workspaceId", authMiddleware, deleteWorkspace);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProjects);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
router.get("/:workspaceId/members", authMiddleware, getWorkspaceMembers);
router.get("/:workspaceId/archived/projects", authMiddleware, getWorkspaceArchivedProjects);
router.get("/:workspaceId/archived/tasks", authMiddleware, getWorkspaceArchivedTasks);
router.post("/:workspaceId/transfer-ownership", authMiddleware, transferWorkspaceOwnership);

export default router;
