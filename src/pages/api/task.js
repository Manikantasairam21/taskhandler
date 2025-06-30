let tasks = [];

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { searchKeyword = "", filterPriority = "" } = req.query;
    const filtered = tasks.filter(t =>
      t.task.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      (!filterPriority || t.priority === filterPriority)
    );
    res.status(200).json(filtered);
  }

  else if (req.method === "POST") {
    const { task, priority, deadline } = req.body;
    if (!task || !priority || !deadline)
      return res.status(400).json({ message: "Missing required fields" });
    const newTask = {
      _id: Date.now().toString(),
      task,
      priority,
      deadline,
      done: false,
    };
    tasks.push(newTask);
    res.status(201).json({ message: "Task created", task: newTask });
  }

  else if (req.method === "PUT") {
    const { id, task, priority, deadline, done } = req.body;
    const index = tasks.findIndex(t => t._id === id);
    if (index === -1) return res.status(404).json({ message: "Task not found" });
    if (task !== undefined) tasks[index].task = task;
    if (priority !== undefined) tasks[index].priority = priority;
    if (deadline !== undefined) tasks[index].deadline = deadline;
    if (done !== undefined) tasks[index].done = done;
    res.status(200).json({ message: "Task updated" });
  }

  else if (req.method === "DELETE") {
    const { id } = req.query;
    const index = tasks.findIndex(t => t._id === id);
    if (index === -1) return res.status(404).json({ message: "Task not found" });
    tasks.splice(index, 1);
    res.status(200).json({ message: "Task deleted" });
  }

  else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
