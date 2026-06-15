import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Users, Receipt, Clock, X, UserPlus, Loader2, Check, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groups as mockGroups, type Group } from "@/lib/mock-data";
import { fetchGroups, createGroup, fetchUsers, registerUser, createMembership, deleteMembership, deleteGroup } from "@/lib/api";

export const Route = createFileRoute("/groups")({
  head: () => ({ meta: [{ title: "Groups — SplitWell" }, { name: "description", content: "Manage your expense groups and members." }] }),
  component: GroupsPage,
});

function GroupsPage() {
  const [selected, setSelected] = useState<Group | null>(null);
  const [groupsList, setGroupsList] = useState<Group[]>(mockGroups);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Group creation states
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  
  // Member registration states
  const [newMemName, setNewMemName] = useState("");
  const [newMemEmail, setNewMemEmail] = useState("");
  const [newMemPhone, setNewMemPhone] = useState("");
  const [isRegisteringMem, setIsRegisteringMem] = useState(false);

  // Invite member by email state
  const [inviteEmail, setInviteEmail] = useState("");

  const loadGroupsAndUsers = async () => {
    setLoading(true);
    try {
      const grpData = await fetchGroups();
      if (grpData) setGroupsList(grpData);
      
      const userData = await fetchUsers();
      if (userData) setAllUsers(userData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroupsAndUsers();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    try {
      const createdGroup = await createGroup(newGroupName);
      const groupId = createdGroup.id;
      
      // Create memberships for all selected users
      for (const userId of selectedUserIds) {
        await createMembership(userId, groupId);
      }
      
      setNewGroupName("");
      setSelectedUserIds([]);
      setIsCreating(false);
      loadGroupsAndUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    }
  };

  const handleRegisterNewMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemName.trim() || !newMemEmail.trim()) return;
    
    setIsRegisteringMem(true);
    try {
      const regResult = await registerUser({
        name: newMemName,
        email: newMemEmail,
        phone: newMemPhone,
        password: "DefaultPassword123"
      });
      
      // Add the new user to the list of all users and automatically select them
      const newUserId = regResult.id;
      const newUserObj = { id: newUserId, name: newMemName, email: newMemEmail, phone: newMemPhone };
      
      setAllUsers((prev) => [...prev, newUserObj]);
      setSelectedUserIds((prev) => [...prev, newUserId]);
      
      // Reset registration form
      setNewMemName("");
      setNewMemEmail("");
      setNewMemPhone("");
      alert(`Member "${newMemName}" registered and added to selection!`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to register new member.");
    } finally {
      setIsRegisteringMem(false);
    }
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !selected) return;
    const groupIdInt = parseInt(selected.id.replace(/[^\d]/g, ""));
    if (isNaN(groupIdInt)) {
      alert("Cannot add members to a mock group.");
      return;
    }
    
    try {
      // Check if user exists in allUsers list
      const existingUser = allUsers.find(u => u.email.toLowerCase() === inviteEmail.trim().toLowerCase());
      let userId: number;

      if (existingUser) {
        userId = existingUser.id;
      } else {
        // Prompt for name/phone and register new user
        const name = prompt(`User with email "${inviteEmail}" not found. Enter name to register & invite them:`);
        if (!name) return;
        const phone = prompt("Enter phone number (optional):") || "";
        const regResult = await registerUser({
          name,
          email: inviteEmail.trim(),
          phone,
          password: "DefaultPassword123"
        });
        userId = regResult.id;
      }

      await createMembership(userId, groupIdInt);
      setInviteEmail("");
      
      // Reload group memberships and update list
      const updatedGroups = await fetchGroups();
      if (updatedGroups) {
        setGroupsList(updatedGroups);
        const updatedSelected = updatedGroups.find(g => g.id === selected.id);
        if (updatedSelected) {
          setSelected(updatedSelected);
        }
      }
      
      // Refresh users list
      const userData = await fetchUsers();
      if (userData) setAllUsers(userData);
      
      alert("Member added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add member to group");
    }
  };

  const handleRemoveMember = async (userIdStr: string) => {
    if (!selected) return;
    const groupIdInt = parseInt(selected.id.replace(/[^\d]/g, ""));
    const userIdInt = parseInt(userIdStr.replace(/[^\d]/g, ""));
    if (isNaN(groupIdInt) || isNaN(userIdInt) || groupIdInt <= 2) {
      // Fallback for mock data
      setSelected((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          members: prev.members.filter((mem) => mem.id !== userIdStr),
        };
      });
      alert("Member removed successfully!");
      return;
    }
    
    if (!confirm("Are you sure you want to remove this member from the group?")) return;

    try {
      await deleteMembership(userIdInt, groupIdInt);
      alert("Member removed successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to remove member");
    }
    
    // Always reload groups to refresh UI lists
    try {
      const updatedGroups = await fetchGroups();
      if (updatedGroups) {
        setGroupsList(updatedGroups);
        const updatedSelected = updatedGroups.find(g => g.id === selected.id);
        if (updatedSelected) {
          setSelected(updatedSelected);
        } else {
          setSelected(null);
        }
      }
    } catch (e) {
      console.error("Failed to refresh groups", e);
    }
  };

  const handleDeleteGroup = async (groupIdStr: string) => {
    const groupIdInt = parseInt(groupIdStr.replace(/[^\d]/g, ""));
    if (isNaN(groupIdInt) || groupIdInt <= 2) {
      // Local mock group delete
      setGroupsList((prev) => prev.filter((g) => g.id !== groupIdStr));
      setSelected(null);
      alert("Mock group deleted successfully!");
      return;
    }

    if (!confirm("Are you sure you want to delete this group? All memberships and expenses inside this group will be permanently deleted.")) return;

    try {
      await deleteGroup(groupIdInt);
      alert("Group deleted successfully!");
      setSelected(null);
      loadGroupsAndUsers();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete group");
    }
  };


  return (
    <div className="flex flex-col gap-6 py-2">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Groups</h1>
          <p className="text-sm text-muted-foreground">Track who's sharing what across your circles.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="rounded-2xl">
          <Plus className="mr-1 h-4 w-4" /> Create Group
        </Button>
      </header>

      {isCreating && (
        <div className="card-soft p-6 flex flex-col gap-6 border border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Create a New Group</h2>
            <Button size="icon" variant="ghost" onClick={() => setIsCreating(false)}><X className="h-4 w-4" /></Button>
          </div>
          
          <form onSubmit={handleCreateGroup} className="flex flex-col gap-6">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase">Group Name</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g. Goa Trip, Flatmates, Shared Expenses..."
                className="mt-1 h-11 rounded-xl bg-background"
                required
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Existing Members Selector */}
              <div className="card-soft p-4 bg-background">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Add Existing Members</h3>
                {allUsers.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No registered members found.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
                    {allUsers.map((u) => {
                      const isChecked = selectedUserIds.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => toggleUserSelection(u.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-left transition text-sm ${isChecked ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary/40 hover:bg-secondary/80 border border-transparent"}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-bold">
                              {u.name[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold">{u.name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                          {isChecked && <Check className="h-4 w-4 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add New Member Block */}
              <div className="card-soft p-4 bg-background">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Register &amp; Add New Member</h3>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Full Name"
                    value={newMemName}
                    onChange={(e) => setNewMemName(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={newMemEmail}
                    onChange={(e) => setNewMemEmail(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                  <Input
                    placeholder="Phone Number (optional)"
                    value={newMemPhone}
                    onChange={(e) => setNewMemPhone(e.target.value)}
                    className="h-10 rounded-xl"
                  />
                  <Button
                    type="button"
                    onClick={handleRegisterNewMember}
                    disabled={isRegisteringMem}
                    variant="outline"
                    className="h-10 rounded-xl text-xs font-bold"
                  >
                    {isRegisteringMem ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <UserPlus className="h-3 w-3 mr-1" />}
                    Register &amp; Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Summary */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-secondary/30 rounded-xl">
              <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">Members Selected ({selectedUserIds.length}):</span>
              <div className="flex -space-x-1.5 overflow-hidden">
                {selectedUserIds.map((id) => {
                  const user = allUsers.find(u => u.id === id);
                  return user ? (
                    <div key={id} title={user.name} className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-extrabold border-2 border-background">
                      {user.name[0].toUpperCase()}
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="h-11 rounded-xl px-6">Create Group</Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="h-11 rounded-xl px-6">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groupsList.map((g) => (
            <button key={g.id} onClick={() => setSelected(g)} className="card-soft card-soft-hover group p-6 text-left">
              <div className="mb-4 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  <Clock className="h-3 w-3" /> {g.lastActivity}
                </span>
              </div>
              <h3 className="text-lg font-bold">{g.name}</h3>
              <div className="mt-1 text-xs text-muted-foreground">{g.members.length} members</div>
              <div className="mt-5 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {g.members.slice(0, 4).map((m) => (
                    <img key={m.id} src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full border-2 border-card object-cover" />
                  ))}
                  {g.members.length > 4 && (
                    <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-card bg-secondary text-xs font-semibold">
                      +{g.members.length - 4}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                  <Receipt className="h-4 w-4" /> {g.expenseCount}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setSelected(null)}>
          <div className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-2xl md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-extrabold truncate">{selected.name}</h2>
                <button
                  onClick={() => handleDeleteGroup(selected.id)}
                  className="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive hover:underline cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Group
                </button>
              </div>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary shrink-0 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <div className="card-soft mb-4 p-4">
              <form onSubmit={handleInviteMember} className="flex items-center gap-2">
                <Input
                  placeholder="Add member by email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="rounded-xl"
                  required
                />
                <Button type="submit" size="icon" className="rounded-xl"><UserPlus className="h-4 w-4" /></Button>
              </form>
            </div>
            <div className="card-soft p-4">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Members</h3>
              <div className="flex flex-col gap-3">
                {selected.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-secondary/50">
                    <img src={m.avatar} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold">{m.name}</div>
                      <div className="text-xs text-muted-foreground">Joined {m.joinDate}{m.leaveDate ? ` · Left ${m.leaveDate}` : ""}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-xs font-semibold text-destructive hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}