import { useState, useEffect } from "react";
import "./ToDoList.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToDoList(){
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    });
    const [task, setTask] = useState("")

    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");

    const [deadline, setDeadline] = useState("")

    function handleInputHandler(event){
        setTask(event.target.value)

    }
    function addTask(){
        if(task.trim() === ""){
            toast.error("Task cannot be empty");
            return;
        }

        if(!deadline){
            toast.error("Please select a deadline");
            return;
        }

        const now = new Date();
        const selectedDeadline = new Date(deadline);

        if(selectedDeadline <= now){
            toast.error("Deadline must be in the future");
            return;
        }

        const newTask = {
            text : task,
            completed : false,
            deadline : deadline
        }

        setTasks([...tasks, newTask])
        setTask("")
        setDeadline("")
    }

    function deleteTask(id){
        setTasks(tasks.filter((task, index) => index !== id))
    }

    function toggleComplete(index){
        setTasks(tasks.map((task, i) => {
            if(i === index){
                return {...task, completed : !task.completed}
            }
            return task
        }))
    }

    function editTask(index){
        setEditIndex(index)
        setEditText(tasks[index].text)

    }

    function saveEdit(index){
        if(editText.trim() === "") return;

        const updatedTasks = tasks.map((task, i) =>{
            if (i === index){
                return {...task, text : editText}
            }
            return task
        })

        setTasks(updatedTasks)
        setEditIndex(null)
    }

    


    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }, [tasks])

    useEffect(() => {
        const interval = setInterval(()=>{
            const now = new Date();

            tasks.forEach( task => {
                if (task.deadline && !task.completed){
                    const deadLineTime = new Date(task.deadline);

                    if(now > deadLineTime){
                        toast.error(`Deadline passed for: ${task.text}`)
                    }
                }
            });
        }, 30000);

        return () => clearInterval(interval);
    }, [tasks]);

    return(
        <div className="to-do-list">
            <h1>ToDo</h1>
            
            <div>
                <input 
                    type="text"
                    placeholder="Enter a Task"
                    value={task}
                    onChange={handleInputHandler}/>
                
                <input
                    type="datetime-local"
                    value={deadline}
                    min={new Date().toISOString().slice(0,16)}
                    onChange={(e)=>setDeadline(e.target.value)}/>

                <button
                    className="add-button"
                    onClick={addTask}>
                    Add

                </button>
            </div>
            <ul>
                {tasks.map((task, index) => {
                   return (
                        <li key={index}>
                            {
                                editIndex === index ? (
                                    <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)}/>
                                ) : (
                                    <span className="task-text" style={{textDecoration : task.completed ? 'line-through' : 'none'}}>{task.text}</span>
                                )
                            
                            }
                            <span className="deadline">
                                {task.deadline  && new Date(task.deadline).toLocaleString()}

                            </span>
                            <input 
                                type="checkbox"
                                className="checkbox"
                                checked = {task.completed}
                                onChange={()=>toggleComplete(index)}
                                disabled={editIndex === index}
                                style={{visibility : editIndex === index ? 'hidden' : 'visible' }}/>

                            {
                                editIndex === index ? (
                                    <button onClick={() => saveEdit(index)}>Save</button>
                                ) : (
                                    <button className="edit-button" onClick={() => editTask(index)}>Edit</button>
                                )
                            }
                            <button
                                className="delete-button"
                                onClick={()=>deleteTask(index)}>
                                Delete

                            </button>
                    </li>
                   )
                   
                })}
            </ul>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
        
    )
}


export default ToDoList;