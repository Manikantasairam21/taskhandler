import clientPromise from "../../utils/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("task_manager"); // Use the "task_manager" database

    if (req.method === "GET") {
      const { searchKeyword = "", filterPriority = "" } = req.query;

      // Fetch tasks based on search and filter criteria
      const query = {
        task: { $regex: searchKeyword, $options: "i" }, // Case-insensitive search for task names
      };

      if (filterPriority) {
        query.priority = filterPriority; // Add priority filter if set
      }

      const tasks = await db.collection("tasks").find(query).toArray();
      res.status(200).json(tasks); // Send back the tasks as JSON

    } else if (req.method === "POST") {
      const { task, priority, deadline } = req.body;

      if (!task || !priority || !deadline) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newTask = {
        task,
        priority,
        deadline,
        done: false,
      };

      const result = await db.collection("tasks").insertOne(newTask);
      res.status(201).json({ message: "Task created", taskId: result.insertedId });
    } else {
      // Handle unsupported methods
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
