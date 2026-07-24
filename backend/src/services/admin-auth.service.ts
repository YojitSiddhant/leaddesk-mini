import { ADMIN_SESSION_DURATION_MS } from "@/constants/admin-auth.constants";
import { AppError } from "@/errors/app-error";
import { createAdminSession, deleteAdminSessionByToken, findAdminSessionByToken } from "@/repositories/admin-session.repository";
import { findAdminUserByEmail, mapAdminUserSummary } from "@/repositories/admin-user.repository";
import type { AdminLoginDto } from "@/validators/admin.validator";
import { generateSessionToken, hashSessionToken } from "@/utils/session-token";
import { verifyAdminPassword } from "@/utils/password";

export const loginAdminUser = async (input: AdminLoginDto) => {
  const adminUser = await findAdminUserByEmail(input.email);

  if (!adminUser) {
    throw new AppError(
      "Invalid email or password.",
      401,
      true,
      "INVALID_CREDENTIALS",
    );
  }

  const isPasswordValid = await verifyAdminPassword(
    input.password,
    adminUser.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError(
      "Invalid email or password.",
      401,
      true,
      "INVALID_CREDENTIALS",
    );
  }

  const sessionToken = generateSessionToken();
  const sessionTokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_DURATION_MS);

  await createAdminSession({
    sessionTokenHash,
    adminUserId: adminUser.id,
    expiresAt,
  });

  return {
    adminUser: mapAdminUserSummary(adminUser),
    sessionToken,
  };
};

export const getAdminUserFromSession = async (sessionToken: string) => {
  const sessionTokenHash = hashSessionToken(sessionToken);
  const session = await findAdminSessionByToken(sessionTokenHash);

  if (!session) {
    throw new AppError("Unauthorized.", 401, true, "UNAUTHORIZED");
  }

  return {
    adminUser: session.adminUser,
  };
};

export const logoutAdminSession = async (sessionToken: string) => {
  const sessionTokenHash = hashSessionToken(sessionToken);
  await deleteAdminSessionByToken(sessionTokenHash);
};
