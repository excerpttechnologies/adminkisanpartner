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

import React from 'react'

const page = () => {
  return (
    <div>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident minima quas ullam libero quidem quia iusto vitae, distinctio ad! Sequi sapiente necessitatibus id aut natus eius ipsa rem distinctio odit, sit aliquam numquam, optio adipisci iure doloribus quasi quod laudantium nisi temporibus corrupti vel animi reprehenderit ut? Delectus aperiam deleniti tempore iste voluptas modi ipsa enim magni? Consectetur velit laboriosam accusamus, in non suscipit nemo culpa, est esse minima ipsam. Sapiente hic veritatis cupiditate, ullam, dicta nihil, quidem id dolore aliquid iure impedit quasi. Quod rerum suscipit officiis harum accusamus esse cumque ab consequatur autem sapiente delectus corrupti veritatis, id assumenda est voluptatum dolor dignissimos labore debitis! Explicabo officia mollitia ad sunt velit rerum quos, molestias, facere ut beatae enim, dolorem animi debitis itaque veniam laboriosam deserunt recusandae magni est ab! Suscipit mollitia corrupti fugit quasi ducimus doloremque soluta amet excepturi exercitationem, at provident, neque cupiditate quidem vitae iusto, pariatur dicta rerum facilis. Optio, quo commodi animi quisquam reiciendis impedit. Est autem dolorem quibusdam veritatis odio necessitatibus, illo omnis a iusto maxime corrupti doloremque consequatur cumque, quod ipsum quam fuga sed pariatur repudiandae. Veritatis possimus optio enim quo assumenda atque at dignissimos, consectetur accusamus, cupiditate, perferendis dolorum incidunt recusandae sint natus ratione expedita corporis doloremque? Voluptas minima in nemo asperiores autem esse beatae reiciendis labore eveniet deleniti explicabo quidem ipsum quasi, aliquid hic corrupti sit consequuntur soluta facilis. Illum repudiandae repellendus nesciunt aspernatur excepturi aut neque. Illum, nisi aperiam animi quam nemo quidem provident repellendus odit rerum delectus. Quas amet eos nihil ipsum quae quam sed sunt, possimus suscipit perspiciatis et ducimus! Voluptatum velit libero magni quaerat obcaecati aliquam? Nobis nostrum doloribus iusto nisi atque expedita! Corporis dicta voluptatem est? Excepturi asperiores rerum vero quo vel minima cum molestias, velit veniam temporibus aut natus at facere dolorem ut, consequuntur corrupti reiciendis. Vero nihil fugit velit sequi facere odio consequuntur, a explicabo iure maxime eveniet minima, nesciunt obcaecati debitis. Assumenda libero corrupti quibusdam sit qui odio doloremque omnis unde? Molestias cupiditate deleniti culpa saepe adipisci quas provident voluptatibus ipsam velit accusantium laboriosam debitis maxime ipsum nemo ex enim, eos eaque qui eligendi voluptate numquam laudantium magni odio. Aspernatur maxime nemo sit quo magnam totam explicabo ipsum ipsa nihil accusantium iste natus minus fugiat perspiciatis nostrum, iure libero delectus placeat ab a tenetur consequatur, nam voluptatum. Tenetur modi illum error ea deleniti deserunt vel maiores dolor dolore eveniet asperiores iste facere doloribus, harum obcaecati libero fugiat odio! Quam tempora repellendus voluptates ipsum. Quisquam ut in reiciendis repudiandae ducimus. Libero tempora non voluptatum harum quibusdam inventore commodi aliquid numquam, quaerat suscipit incidunt, natus sit ducimus quam placeat quia similique. At eveniet sunt adipisci reiciendis quidem esse nemo vero vitae, reprehenderit error voluptatibus explicabo accusamus, possimus ipsa, ducimus perferendis? Mollitia vero a praesentium voluptate aperiam pariatur voluptatum eum repudiandae. Ullam, vero voluptas sit nisi quaerat at deleniti, rem eaque quidem dolorem neque quam reprehenderit, perferendis accusantium vitae nulla recusandae laborum ipsum temporibus voluptate! Ullam praesentium libero optio qui animi laudantium, dolorum impedit non sed ipsam rerum! Adipisci, libero neque, non iusto minus molestias, minima corporis qui quia repellat nihil quo ea quod ipsam maiores natus delectus itaque sapiente ullam? Nemo modi praesentium odio obcaecati, expedita neque, minus, esse sint magni quidem eum autem? Beatae non, fugiat maiores id nulla odit? In eos eius delectus illum, dolor laborum recusandae voluptas quaerat voluptates corporis qui explicabo alias accusamus temporibus? Quas autem aspernatur cupiditate eos quo dicta veritatis reprehenderit nihil blanditiis, dolorum nesciunt tempore corrupti. Tenetur in voluptates accusamus mollitia, quod eligendi dolore. Libero quis, magni, porro eos sit reiciendis soluta illo animi non adipisci deserunt ipsum sunt, optio nisi veritatis numquam fugiat! Repudiandae, fugiat corrupti. Dolor perspiciatis architecto animi molestias distinctio, beatae porro ipsa esse enim culpa nam nostrum tenetur incidunt, omnis iusto asperiores recusandae! Sunt, in esse, similique nulla perferendis reprehenderit inventore ratione ea quasi veniam molestias modi, distinctio porro. Voluptate dolore aspernatur vero tenetur tempora voluptas eos, repellat nulla velit! Quos sit eum, ratione velit dolorum quisquam iure soluta reiciendis fugiat ullam, ipsam molestias labore itaque expedita? Architecto aperiam voluptate fugit debitis minus illum officiis enim laborum vero praesentium, dolor excepturi illo itaque similique nulla! Dolore alias inventore eos, ipsam officiis laboriosam exercitationem in fugiat quaerat modi fugit iure non amet, ut odio unde? Ea quia quisquam quae libero repellendus possimus dicta temporibus blanditiis distinctio. Tempora doloremque reprehenderit dolore excepturi consequuntur eos culpa perferendis. Commodi suscipit dolorem tempore? In earum minus perferendis nisi labore, voluptatem distinctio voluptatibus, reiciendis, nihil illum iure eum? Rerum fugit, omnis nostrum quo animi adipisci vel autem unde, delectus iure nesciunt nisi amet repudiandae quidem blanditiis? Architecto id velit deserunt nam omnis qui veritatis officia porro repellat et! Alias, unde blanditiis pariatur nihil provident quia asperiores reprehenderit ipsa natus voluptatum maxime aspernatur enim itaque! Itaque aperiam alias consequatur corrupti ad recusandae minima laboriosam fuga laborum qui eligendi magnam, natus voluptas reiciendis exercitationem doloribus illo cum possimus incidunt. Aut, deleniti error? Eaque mollitia, molestias fugiat accusantium culpa aut ea deserunt. Consectetur facilis voluptates, reprehenderit quod commodi saepe exercitationem eligendi quam iusto sed non amet veritatis aliquam blanditiis fuga eius vel velit tempore perspiciatis architecto obcaecati minima modi laborum. Accusantium, aspernatur, consequuntur magni sunt iure quam incidunt aliquam assumenda laudantium quis hic excepturi nobis vel enim id aperiam, quidem doloremque a. Consequatur ipsa earum optio beatae porro consequuntur distinctio, nulla tenetur excepturi ab doloremque eveniet! Eaque, alias! Modi, ea hic quod ab veritatis est rerum voluptas nesciunt officiis iure similique suscipit quo, laborum quas incidunt voluptatem? Soluta, quisquam, laudantium temporibus explicabo accusamus molestias numquam esse atque fugit voluptatibus, iste mollitia. Ullam delectus quaerat dolorem accusantium cupiditate odit reprehenderit eius doloribus quasi impedit pariatur fugiat, est aliquid enim ab exercitationem aut! Voluptatibus alias, ducimus qui vel dicta, commodi est totam culpa cupiditate consectetur cumque quia iusto corporis quod omnis. Quidem dolor iusto provident quaerat magnam perspiciatis aliquid magni sint minima necessitatibus, fugit esse, non incidunt alias debitis vitae illo sed maiores! Nihil nulla molestias ullam provident deserunt voluptatum corporis iste! In, natus odit?
    </div>
  )
}

export default page

