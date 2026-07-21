import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import { Columns3, Plus, Flag, Clock, CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";
import { GlassCard } from "@/components/maxces/GlassCard";
import { TopBar } from "@/components/maxces/TopBar";
import { EmptyState, PageContainer } from "@/components/maxces/Primitives";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "MAXCES · Tasks" }] }),
  component: TasksPage,
});

type Priority = "high" | "medium" | "low";
type TaskStatus = "todo" | "in-progress" | "done";

interface Task {
  id: string;
  t: string;
  pr: Priority;
  time?: string;
}

interface Column {
  id: TaskStatus;
  label: string;
  tasks: Task[];
}

const INITIAL_COLUMNS: Column[] = [
  {
    id: "todo",
    label: "To Do",
    tasks: [
      { id: "t1", t: "Design landing page hero section", pr: "high", time: "2h" },
      { id: "t2", t: "Set up Supabase RLS for new table", pr: "medium", time: "1h" },
      { id: "t3", t: "Write API documentation", pr: "low" },
    ],
  },
  {
    id: "in-progress",
    label: "In Progress",
    tasks: [
      { id: "t4", t: "Build ZIP import engine", pr: "high", time: "4h" },
      { id: "t5", t: "Integrate GitHub OAuth flow", pr: "high" },
      { id: "t6", t: "Polish mobile sidebar", pr: "medium", time: "45m" },
    ],
  },
  {
    id: "done",
    label: "Done",
    tasks: [
      { id: "t7", t: "Setup Vite + React boilerplate", pr: "medium" },
      { id: "t8", t: "Configure Tailwind theme tokens", pr: "low" },
      { id: "t9", t: "Deploy to Vercel staging", pr: "high" },
      { id: "t10", t: "Write README instructions", pr: "low" },
    ],
  },
];

const priorityColors: Record<Priority, string> = {
  high: "text-red-400 bg-red-500/10",
  medium: "text-amber-400 bg-amber-500/10",
  low: "text-slate-400 bg-slate-500/10",
};

const priorityDot: Record<Priority, string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-slate-500",
};

const colHeaderStyles: Record<TaskStatus, string> = {
  "todo": "text-slate-400 border-slate-500/30",
  "in-progress": "text-purple-400 border-purple-500/30",
  "done": "text-emerald-400 border-emerald-500/30",
};

export function TasksPage() {
  const [columns, setColumns] = useState<Column[]>(INITIAL_COLUMNS);
  const [newTaskModal, setNewTaskModal] = useState<TaskStatus | null>(null);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("medium");

  const toggleDone = useCallback((colId: TaskStatus, taskId: string) => {
    if (colId === "done") {
      // Move back to todo
      setColumns((prev) => {
        const doneCol = prev.find((c) => c.id === "done")!;
        const task = doneCol.tasks.find((t) => t.id === taskId)!;
        return prev.map((c) => {
          if (c.id === "done") return { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) };
          if (c.id === "todo") return { ...c, tasks: [task, ...c.tasks] };
          return c;
        });
      });
    } else {
      // Move to done
      setColumns((prev) => {
        const srcCol = prev.find((c) => c.id === colId)!;
        const task = srcCol.tasks.find((t) => t.id === taskId)!;
        return prev.map((c) => {
          if (c.id === colId) return { ...c, tasks: c.tasks.filter((t) => t.id !== taskId) };
          if (c.id === "done") return { ...c, tasks: [task, ...c.tasks] };
          return c;
        });
      });
    }
  }, []);

  const addTask = useCallback(() => {
    if (!newTaskText.trim() || !newTaskModal) return;
    const newTask: Task = {
      id: `t${Date.now()}`,
      t: newTaskText.trim(),
      pr: newTaskPriority,
    };
    setColumns((prev) =>
      prev.map((c) => c.id === newTaskModal ? { ...c, tasks: [newTask, ...c.tasks] } : c)
    );
    setNewTaskText("");
    setNewTaskModal(null);
  }, [newTaskText, newTaskModal, newTaskPriority]);

  return (
    <PageContainer>
      <TopBar
        title="Tasks"
        subtitle="Kanban board — drag tasks across columns"
        actions={
          <button
            onClick={() => setNewTaskModal("todo")}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:scale-105 transition-transform"
            aria-label="Add new task"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden /> New Task
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" role="region" aria-label="Task kanban board">
        {columns.map((col) => (
          <section key={col.id} aria-labelledby={`col-${col.id}-heading`}>
            <GlassCard hover={false}>
              {/* Column Header */}
              <div className={`flex items-center justify-between mb-4 pb-3 border-b ${colHeaderStyles[col.id]}`}>
                <div className="flex items-center gap-2">
                  <Columns3 className="h-3.5 w-3.5" aria-hidden />
                  <h2 id={`col-${col.id}-heading`} className="text-xs font-semibold uppercase tracking-wider">
                    {col.label}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                    aria-label={`${col.tasks.length} tasks`}
                  >
                    {col.tasks.length}
                  </span>
                  <button
                    onClick={() => setNewTaskModal(col.id)}
                    aria-label={`Add task to ${col.label}`}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>

              {/* Task List */}
              <ul className="space-y-2.5 min-h-[120px]" role="list">
                {col.tasks.length === 0 ? (
                  <li>
                    <EmptyState
                      title="No tasks"
                      description="Add a task to get started."
                      size="sm"
                    />
                  </li>
                ) : (
                  col.tasks.map((task) => (
                    <motion.li
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="group flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] p-3 hover:bg-white/[0.05] hover:border-white/12 transition-all cursor-default"
                    >
                      <button
                        onClick={() => toggleDone(col.id, task.id)}
                        aria-label={col.id === "done" ? `Mark "${task.t}" as todo` : `Mark "${task.t}" as done`}
                        className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {col.id === "done"
                          ? <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden />
                          : <Circle className="h-4 w-4" aria-hidden />
                        }
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-relaxed ${col.id === "done" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.t}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${priorityColors[task.pr]}`}
                            aria-label={`${task.pr} priority`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[task.pr]}`} aria-hidden />
                            <Flag className="h-2.5 w-2.5" aria-hidden />
                            {task.pr}
                          </span>
                          {task.time && (
                            <span className="inline-flex items-center gap-1 text-[9px] text-muted-foreground">
                              <Clock className="h-2.5 w-2.5" aria-hidden />
                              {task.time}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.li>
                  ))
                )}
              </ul>
            </GlassCard>
          </section>
        ))}
      </div>

      {/* Add Task Modal */}
      {newTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add new task">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNewTaskModal(null)} aria-hidden />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm rounded-3xl glass-strong p-6 shadow-2xl"
          >
            <h3 className="font-bold text-foreground text-base mb-4">New Task</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="task-title" className="text-xs text-muted-foreground font-medium mb-1.5 block">Task title</label>
                <input
                  id="task-title"
                  autoFocus
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  placeholder="What needs to be done?"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-purple-500/60"
                />
              </div>
              <div>
                <label htmlFor="task-priority" className="text-xs text-muted-foreground font-medium mb-1.5 block">Priority</label>
                <select
                  id="task-priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-purple-500/60"
                >
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">⚪ Low</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={addTask}
                  disabled={!newTaskText.trim()}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 text-xs font-semibold text-white disabled:opacity-50 hover:scale-[1.01] transition-transform"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setNewTaskModal(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PageContainer>
  );
}
