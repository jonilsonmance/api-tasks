
import { Database } from './database.js'
import { randomUUID } from 'crypto'
import { buildRoutePath } from './utils/build-route-path.js'




import formidable from 'formidable'



const database = new Database()
export const routes = [
    {
        method:'GET',
        path: buildRoutePath('/tasks'),
        handler:(req, res)=>{
            const tasks = database.select("tasks")

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method:'POST',
        path: buildRoutePath('/tasks'),
        handler:(req, res)=>{
            const {title, description} = req.body

            const now = new Date().toISOString();

            const task = {
                id:randomUUID(),
                title, 
                description,
                created_at: now,
                updated_at: now 
            }

            database.insert("tasks", task)

            return res.writeHead(201).end('Criação de task')
        }
    },
    {
        method:'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler:(req, res)=> {
            
            const {id} = req.params
            const {title, description} = req.body

            const now = new Date().toISOString();

            database.update('tasks', id,{ 
                title,
                description,
                updated_at: now
                
            })

            return res.writeHead(204).end()
        },
    },
    {
        method:'PATCH', 
        path: buildRoutePath('/tasks/:id/complete'),
        handler:(req, res)=>{
            const {id} = req.params

            const task = database.select('tasks').find(task =>task.id === id);

            if(!task){
                return res.writeHead(404).end(JSON.stringify({error: 'Tasks not found'}))
            }

            if (task.completed_at) {
                return res.writeHead(400).end(JSON.stringify({ error: 'Task is already completed' }));
            }

            const now = new Date().toISOString();

            database.update('tasks', id, {
                ...task,
                completed_at: now,
                updated_at: now
            });
    
            return res.writeHead(204).end();

        }

    },
    {
        method:'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler:(req, res)=> {
            
            const {id} = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        },
    }, 
    
    
]
