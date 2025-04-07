import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IndeterminateCheckbox } from "@/components/ui/indeterminate-checkbox";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};

export default function Page3() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // New user modal state
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"operator" | "admin" | "system admin">(
    "operator"
  );
  const [permPage1, setPermPage1] = useState(false);
  const [permPage2, setPermPage2] = useState(false);
  const [permPage3, setPermPage3] = useState(false);
  const [permPage4, setPermPage4] = useState(false);

  const isAllSelected = selectedIds.length === users.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < users.length;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const token = Cookies.get("access_token");
    try {
      const res = await fetch("http://api.odensebartech.com/api/v1/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (isAllSelected || isIndeterminate) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  }

  async function handleDeleteSelected() {
    const token = Cookies.get("access_token");
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`http://api.odensebartech.com/api/v1/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      toast.success("Users deleted");
      setSelectedIds([]);
      await fetchUsers();
    } catch (err) {
      toast.error("Failed to delete users");
    }
  }

  async function handleCreateUser() {
    const token = Cookies.get("access_token");

    // Build permissions array based on switches
    const permissions: string[] = [];
    if (permPage1) permissions.push("page1");
    if (permPage2) permissions.push("page2");
    if (permPage3) permissions.push("page3");
    if (permPage4) permissions.push("page4");

    try {
      const res = await fetch("http://api.odensebartech.com/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          password: newPassword,
          role: newRole,
          permissions,
        }),
      });

      if (!res.ok) throw new Error("Failed to create user");

      toast.success("User created");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("operator");
      // Reset permission switches
      setPermPage1(false);
      setPermPage2(false);
      setPermPage3(false);
      setPermPage4(false);
      setCreating(false);
      await fetchUsers();
    } catch (err: any) {
      toast.error("Error creating user", {
        description: err.message,
      });
    }
  }

  if (loading) return <div className="p-4">Loading users...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header and controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedIds.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                </AlertDialogHeader>
                <p>
                  This will permanently delete {selectedIds.length} user
                  {selectedIds.length > 1 ? "s" : ""}. Are you sure?
                </p>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteSelected}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Dialog open={creating} onOpenChange={setCreating}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-zinc-800">
                <Plus className="w-4 h-4 mr-1" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Select
                  value={newRole}
                  onValueChange={(v) => setNewRole(v as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="system admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <h3 className="font-medium">Permissions</h3>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={permPage1}
                      onCheckedChange={setPermPage1}
                      id="perm-page1"
                    />
                    <label htmlFor="perm-page1" className="text-sm">
                      Page1
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={permPage2}
                      onCheckedChange={setPermPage2}
                      id="perm-page2"
                    />
                    <label htmlFor="perm-page2" className="text-sm">
                      Page2
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={permPage3}
                      onCheckedChange={setPermPage3}
                      id="perm-page3"
                    />
                    <label htmlFor="perm-page3" className="text-sm">
                      Page3
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={permPage4}
                      onCheckedChange={setPermPage4}
                      id="perm-page4"
                    />
                    <label htmlFor="perm-page4" className="text-sm">
                      Page4
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateUser}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-auto border rounded-lg shadow-sm">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="w-10 px-4 py-2 text-center">
                <IndeterminateCheckbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={toggleAll}
                />
              </th>
              <th className="text-left px-4 py-2 font-medium">ID</th>
              <th className="text-left px-4 py-2 font-medium">Name</th>
              <th className="text-left px-4 py-2 font-medium">Email</th>
              <th className="text-left px-4 py-2 font-medium">Role</th>
              <th className="text-left px-4 py-2 font-medium">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const selected = selectedIds.includes(user.id);
              return (
                <tr
                  key={user.id}
                  className={selected ? "bg-accent/40" : ""}
                  onClick={() => toggleSelect(user.id)}
                >
                  <td className="w-10 px-4 py-2 text-center">
                    <Checkbox checked={selected} />
                  </td>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
