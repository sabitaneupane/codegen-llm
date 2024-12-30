import axios from 'axios'
import { config } from '../../config.js'
import 'dotenv/config'

const OLLAMA_API_URL = config.OLLAMA_API_URL

export const generateCode = async (taskDescription) => {
  const prompt = createCodeGenPrompt(taskDescription)

  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}`,
      {
        model: 'mistral',
        prompt: prompt,
        max_tokens: 200,
      },
      {
        responseType: 'stream', // To enable streaming
      }
    )

    let generatedCode = ''

    response.data.on('data', (chunk) => {
      try {
        const chunkData = JSON.parse(chunk.toString())
        generatedCode += chunkData.response || ''
        if (chunkData.done) {
          console.log('Complete generated code:', generatedCode)
        }
      } catch (error) {
        console.error('Error parsing response chunk:', error)
      }
    })

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        resolve(generatedCode)
      })

      response.data.on('error', (err) => {
        reject(err)
      })
    })
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Rate limit exceeded')
    } else {
      console.error('Error generating code:', error)
    }
  }
}

const createCodeGenPrompt = (taskDescription) => {
  return `Write a function that fulfills the following task:\n\n${taskDescription}\n\nGenerated function:\n`
}
