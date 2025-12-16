// "use client";

// import axios from "axios";
// import { useEffect, useState } from "react";

// type TodoType = {
//   _id: string;
//   todo: string;
// };

// const Todo = () => {
//   const [todo, setTodo] = useState("");
//   const [list, setList] = useState<TodoType[]>([]);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // ✅ Fetch Todos
//   const getTodo = async () => {
//     const res = await axios.get("/api/todo");
//     setList(res.data.data);
//   };

//   useEffect(() => {
//     getTodo();
//   }, []);

//   // ✅ Add or Update Todo
//   const submitTodo = async () => {
//     if (!todo.trim()) return;

//     setLoading(true);

//     if (editId) {
//       const id=editId
//       // UPDATE
//       await axios.put(`/api/todo/${id}`, { todo });
//       setEditId(null);
//     } else {
//       // CREATE
//       await axios.post("/api/todo", { todo });
//     }

//     setTodo("");
//     setLoading(false);
//     getTodo();
//   };

//   // ✅ Delete Todo
//   const deleteTodo = async (id: string) => {
//     console.log(id)
//     await axios.delete(`/api/todo/${id}`);
//     getTodo();
//   };

//   // ✅ Edit Todo
//   const editTodo = (item: TodoType) => {
//     setTodo(item.todo);
//     setEditId(item._id);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5">
//       {/* FORM */}
//       <div className="w-96 bg-white p-4 rounded shadow flex gap-2">
//         <input
//           value={todo}
//           onChange={(e) => setTodo(e.target.value)}
//           placeholder="Add todo"
//           className="flex-1 border p-2 rounded outline-none"
//         />
//         <button
//           onClick={submitTodo}
//           disabled={loading}
//           className={`px-4 rounded text-white ${
//             editId ? "bg-blue-500" : "bg-green-500"
//           }`}
//         >
//           {editId ? "Update" : "Add"}
//         </button>
//       </div>

//       {/* LIST */}
//       <div className="w-96 mt-4 flex flex-col gap-2">
//         {list.map((item) => (
//           <div
//             key={item._id}
//             className="bg-white border rounded p-3 flex justify-between items-center"
//           >
//             <p>{item.todo}</p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => editTodo(item)}
//                 className="bg-blue-500 text-white px-3 py-1 rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => deleteTodo(item._id)}
//                 className="bg-red-500 text-white px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Todo;
