// import { checkRole } from "@/app/utils/roles";
// import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // const isAdmin = await checkRole("admin");
  // if (!isAdmin) {
  //   redirect("/");
  // }

  return (
    <p>
      This is the protected admin dashboard restricted to users with the `admin`
      role.
    </p>
  );
}
