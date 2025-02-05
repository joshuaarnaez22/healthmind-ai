import { Roles } from "@/types/global";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  try {
    const { sessionClaims } = await auth();
    if (!sessionClaims?.metadata.role) {
      return false;
    }
    return sessionClaims?.metadata.role === role;
  } catch (error) {
    console.error("Failed to verify role:", error);
    return false;
  }
};
