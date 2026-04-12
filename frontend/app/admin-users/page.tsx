"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ProtectedShell from "@/components/ProtectedShell";
import { getJson, putJson } from "@/lib/api";
import { useEffect, useState } from "react";

type AdminUser = {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  package_name: "starter" | "growth" | "agency";
  is_active: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  async function loadUsers() {
    const data = await getJson<AdminUser[]>("/api/admin-users/all");
    setUsers(data);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updatePackage(userId: number, packageName: string) {
    await putJson(`/api/admin-users/${userId}/package`, {
      package_name: packageName,
    });
    await loadUsers();
  }

  async function updateStatus(userId: number, isActive: boolean) {
    await putJson(`/api/admin-users/${userId}/status`, {
      is_active: isActive,
    });
    await loadUsers();
  }

  return (
    <ProtectedShell>
      <main>
        <Navbar />
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-bold text-white">User Package Management</h2>
            <p className="mt-2 text-zinc-400">
              Assign packages and activate or deactivate user accounts.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-sm text-zinc-300">
                <thead>
                  <tr className="border-b border-white/10 text-left text-zinc-400">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Package</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="p-3">{user.full_name || "No name"}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">{user.package_name}</td>
                      <td className="p-3">
                        {user.is_active ? "active" : "inactive"}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <select
                            value={user.package_name}
                            onChange={(e) => updatePackage(user.id, e.target.value)}
                            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                          >
                            <option value="starter">starter</option>
                            <option value="growth">growth</option>
                            <option value="agency">agency</option>
                          </select>

                          <select
                            value={user.is_active ? "active" : "inactive"}
                            onChange={(e) =>
                              updateStatus(user.id, e.target.value === "active")
                            }
                            className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white"
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-zinc-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </ProtectedShell>
  );
}