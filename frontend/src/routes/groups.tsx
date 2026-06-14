import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Users, Receipt, Clock, X, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groups as mockGroups, type Group } from "@/lib/mock-data";
import { fetchGroups, createGroup } from "@/lib/api";

export const Route = createFileRoute("/groups")({
  head: () => ({ meta: [{ title: "Groups — SplitWell" }, { name: "description", content: "Manage your expense groups and members." }] }),
  component: GroupsPage,
});

function GroupsPage() {
  const [selected, setSelected] = useState<Group | null>(null);
  const [groupsList, setGroupsList] = useState<Group[]>(mockGroups);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const loadGroups = () => {
    setLoading(true);
    fetchGroups().then((data) => {
      if (data) {
        setGroupsList(data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await createGroup(newGroupName);
      setNewGroupName("");
      setIsCreating(false);
      loadGroups();
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
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
        <form onSubmit={handleCreateGroup} className="card-soft flex flex-wrap items-center gap-3 p-4">
          <Input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name..."
            className="flex-1 min-w-[200px] h-11 rounded-xl"
            autoFocus
          />
          <div className="flex gap-2">
            <Button type="submit" className="h-11 rounded-xl">Create</Button>
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="h-11 rounded-xl">Cancel</Button>
          </div>
        </form>
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-xl bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <div className="card-soft mb-4 p-4">
              <div className="flex items-center gap-2">
                <Input placeholder="Add member by email" className="rounded-xl" />
                <Button size="icon" className="rounded-xl"><UserPlus className="h-4 w-4" /></Button>
              </div>
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
                    <button className="text-xs font-semibold text-destructive hover:underline">Remove</button>
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