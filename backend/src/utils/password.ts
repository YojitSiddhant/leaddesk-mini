import bcrypt from "bcrypt";

import { ADMIN_PASSWORD_SALT_ROUNDS } from "@/constants/admin-auth.constants";

export const hashAdminPassword = async (password: string) =>
  bcrypt.hash(password, ADMIN_PASSWORD_SALT_ROUNDS);

export const verifyAdminPassword = async (
  password: string,
  passwordHash: string,
) => bcrypt.compare(password, passwordHash);
