import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { UserPlus, Trash2, Loader2, Mail, Phone, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchUsers, registerUser, deleteUser } from "@/lib/api";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: "Friends — SplitWell" },
      { name: "description", content: "Manage your friends and group members." },
    ],
  }),
  component: FriendsPage,
});

function FriendsPage() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User registration states
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      if (data) {
        setUsersList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    setIsRegistering(true);
    try {
      await registerUser({
        name: newUserName,
        email: newUserEmail,
        phone: newUserPhone || undefined,
        password: "DefaultPassword123",
      });

      setNewUserName("");
      setNewUserEmail("");
      setNewUserPhone("");
      setIsAddingUser(false);
      alert(`Friend "${newUserName}" successfully added!`);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to add user.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleRemoveFriend = async (userId: number, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from your list? This will also remove them from all groups.`)) return;

    try {
      await deleteUser(userId);
      alert(`"${name}" removed successfully.`);
      loadUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to remove user.");
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Friends</h1>
          <p className="text-sm text-muted-foreground">Manage your list of friends and potential group members.</p>
        </div>
        <Button onClick={() => setIsAddingUser(true)} className="rounded-2xl">
          <UserPlus className="mr-1 h-4 w-4" /> Add Friend
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {usersList.map((u) => {
            const avatarChar = u.name ? u.name[0].toUpperCase() : "?";
            return (
              <div key={u.id} className="card-soft card-soft-hover relative p-6 flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary text-lg font-bold shrink-0">
                  {avatarChar}
                </div>
                <div className="min-w-0 flex-1 pr-8">
                  <h3 className="text-lg font-bold truncate">{u.name}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{u.phone}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveFriend(u.id, u.name)}
                  className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition cursor-pointer"
                  title="Remove Friend"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {isAddingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsAddingUser(false)}>
          <div className="w-full max-w-md overflow-hidden rounded-[32px] bg-background border border-primary/10 p-6 shadow-2xl md:p-8 animate-in fade-in-50 zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-foreground">Add New Friend</h2>
              <button onClick={() => setIsAddingUser(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleAddFriend} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                <Input
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Enter full name"
                  className="mt-1 h-11 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Email Address</label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1 h-11 rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                <Input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="Enter phone number (optional)"
                  className="mt-1 h-11 rounded-xl"
                />
              </div>
              <div className="mt-2 flex gap-3">
                <Button type="submit" disabled={isRegistering} className="h-11 flex-1 rounded-xl font-bold">
                  {isRegistering ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <UserPlus className="h-4 w-4 mr-1" />} Add Friend
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)} className="h-11 rounded-xl px-5">Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
