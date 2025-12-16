"use client"

import axios from "axios"
import { useEffect, useState } from "react"


const Todo = () => {

  const [todo,setTodo]=useState<string>("")
  const [list,setList]=useState([])
  const [change,setChage]=useState()

  const addTodo=async()=>{
    const res=await axios.post("http://localhost:3000/api/todo",{todo})
    setChage(res.data.data)
  }

  const getTodo=async()=>{
    const res=await axios.get("http://localhost:3000/api/todo")
    setList(res.data.data)
  }

  useEffect(()=>{
    getTodo()
  },[change])

  return (
    <div className='h-screen w-screen bg-gray-50 flex flex-col items-center'>
 {/* /////form */}
      <div className='w-96 mt-5 border border-zinc-200 h-fit p-4 flex  justify-center items-center bg-white rounded shadow '>
        <input value={todo} onChange={(e)=>setTodo(e.target.value)} placeholder='Add todo' type="text" name="" id=""  className='w-full h-full outline-none border  border-zinc-400 rounded p-4'/>
        <button onClick={addTodo} className='bg-green-500 p-4 ml-3 rounded text-white font-semibold'>add</button>
      </div>

      <div className="flex flex-col gap-y-3 p-3 w-96 ">

        {
         list.map((data,i)=>(
          <div key={i}>
            p
          </div>
         ))
        }

      </div>
     
    </div>
  )
}

export default Todo
