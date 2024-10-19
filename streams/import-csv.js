import fs from 'node:fs'
import { parse } from 'csv-parse'
import { Database } from '../src/database.js'
import { randomUUID } from 'crypto'

const database = new Database()

async function importTasksFromCSV(filePath) {
  const parser = fs.createReadStream(filePath)
    .pipe(parse({
      delimiter: ',', 
      columns: true, 
      trim: true     
    }))

  for await (const record of parser) {
    const { title, description } = record
    const now = new Date().toISOString()

   
    const task = {
      id: randomUUID(),
      title,
      description,
      created_at: now,
      updated_at: now
    }

    // Insere a task no banco de dados
    database.insert('tasks', task)
    console.log(`Task "${title}" importada com sucesso!`)
  }

  console.log('Todas as tasks foram importadas.')
}

// Exemplo de uso: importar tasks do arquivo 'tasks.csv'
const filePath = './tasks.csv'
importTasksFromCSV(filePath)
  .then(() => console.log('Importação finalizada!'))
  .catch((error) => console.error('Erro na importação:', error))
