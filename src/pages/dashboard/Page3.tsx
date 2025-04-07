import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  // password excluded on purpose
};

export default function Page3() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const token = Cookies.get("access_token");
      if (!token) {
        console.error("No access token found");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://api.odensebartech.com/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <div className="overflow-auto border rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-2 font-medium">ID</th>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Email</th>
              <th className="text-left px-4 py-2 font-medium">Role</th>
              <th className="text-left px-4 py-2 font-medium">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <ul className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                    {user.permissions.map((perm, i) => (
                      <li key={i} className="bg-muted px-2 py-0.5 rounded">
                        {perm}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
