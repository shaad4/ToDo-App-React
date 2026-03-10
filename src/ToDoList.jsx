import { useState, useEffect } from "react";
import "./ToDoList.css";

function ToDoList(){
    const [tasks, setTasks] = useState(() => {
        const saved = localStorage.getItem("tasks");
        return saved ? JSON.parse(saved) : [];
    });
    const [task, setTask] = useState("")

    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");

    function handleInputHandler(event){
        setTask(event.target.value)

    }
    function addTask(){
        if(task.trim() === "") return;//if input box is empty then retun none

        const newTask = {
            text : task,
            completed : false
        }

        setTasks([...tasks, newTask])
        setTask("")
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

    return(
        <div className="to-do-list">
            <h1>ToDo</h1>
            
            <div>
                <input 
                    type="text"
                    placeholder="Enter a Task"
                    value={task}
                    onChange={handleInputHandler}/>
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
        </div>
    )
}


export default ToDoList;