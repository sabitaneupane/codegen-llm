import { generateCode } from './codegeneration/index.js'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const main = async () => {
  try {
    rl.question(
      'Please enter the task description for code generation: ',
      async (taskDescription) => {
        if (taskDescription) {
          const generatedCode = await generateCode(taskDescription)
          console.log('Generated Code:\n', generatedCode)
        } else {
          console.log('No task description provided. Exiting...')
        }
        rl.close()
      }
    )
  } catch (err) {
    console.error('Error generating code:', err)
    rl.close()
  }
}

main()
