const path = require('path')
const fs = require('fs')
const { readdir, readFile } = require('node:fs/promises')

const Solution = require('../models/solution')
const SolutionStat = require('../models/SolutionStat')

async function solutionStatUpdate() {
  try{
    console.log(`File Stat Update Started at: ${new Date().toISOString()}`)

    const solutions = await Solution.find({})
    
    const quesIds = solutions.map((sol) => sol.quesId)

    const countCPP = solutions.reduce((acc, sol) => {
      if(sol.language !== 'cpp' || sol.acceptedSolutions.length === 0)
        return acc
      return acc + 1
    }, 0)

    const countJS = solutions.reduce((acc, sol) => {
      if(sol.language !== 'js' || sol.acceptedSolutions.length === 0)
        return acc
      return acc + 1
    }, 0)

    const countSQL = solutions.reduce((acc, sol) => {
      if(sol.language !== 'sql' || sol.acceptedSolutions.length === 0)
        return acc
      return acc + 1
    }, 0)

    const partialCountCPP = solutions.reduce((acc, sol) => {
      if(sol.language !== 'cpp')
        return acc
      return sol.acceptedSolutions.length === 0 ? acc + 1 : acc
    }, 0)

    await SolutionStat.deleteMany({})

    await SolutionStat.create({
      countCPP,
      countJS,
      countSQL,
      partialCountCPP,
      quesIds
    })

    console.log(`File Stat Update Completed at: ${new Date().toISOString()}`) 

  }catch(err){
    console.log('ERROR: solutionStatUpdate()')
    console.log(err)
  }
}

function readAllFiles() {
  return new Promise(async (resolve, reject) => {
    try{
      const solutionsDirPath_cpp = path.join(__dirname, '..', 'LeetcodeSolutions', 'cpp')
      const solutionsDirPath_js = path.join(__dirname, '..', 'LeetcodeSolutions', 'js')
      const solutionsDirPath_sql = path.join(__dirname, '..', 'LeetcodeSolutions', 'sql')
  
      const solutionsDirPaths = [solutionsDirPath_cpp, solutionsDirPath_js, solutionsDirPath_sql]
  
      const solutionsMap = new Map([])
  
      for(const solutionsDirPath of solutionsDirPaths){
        const fileNames = await readdir(solutionsDirPath)
  
        for(const fileName of fileNames){
          const solutionFilePath = path.join(solutionsDirPath, fileName)
  
          const quesId = parseInt(fileName.split('.')[0])
          const title = fileName.split('.')[1].split(' ')[0].split('_').join(' ')
          const language = path.extname(solutionFilePath).substring(1)
          const isAccepted = fileName.search('TLE') === -1 && fileName.search('MLE') === -1
          const fileNameWithoutExt = fileName.split('.')[1]
          const version = parseInt(fileNameWithoutExt[fileNameWithoutExt.length - 2])
          
          const fileData = await readFile(solutionFilePath, 'utf8')
          
          let solution = null
          if(!solutionsMap.has(quesId)){
            solution = {
              quesId,
              title,
              language,
              acceptedSolutions: [],
              unacceptedSolutions: []
            }
          }else{
            solution = solutionsMap.get(quesId)
          }
  
          if(isAccepted){
            solution.acceptedSolutions[version - 1] = fileData
          }else{
            solution.unacceptedSolutions[version - 1] =  fileData
          }
  
          solutionsMap.set(quesId, solution)
        }
      }
  
      const solutionsArray = []
      for(const [key, value] of solutionsMap){
        const { title, language, acceptedSolutions, unacceptedSolutions } = value
        solutionsArray.push({
          quesId: key,
          title,
          language,
          acceptedSolutions,
          unacceptedSolutions
        })
      }
  
      resolve(solutionsArray)
  
    }catch(err){
      console.log('ERROR: readAllFiles()')
      console.log(err)
      reject()
    }
  })
    
}

async function syncAllSolutions() {
  try{
    const startTime = Date.now()
    console.log(`File Sync Started at: ${new Date().toISOString()}`)

    const solutionsArray = await readAllFiles()
    
    await Solution.deleteMany({})
    await Solution.insertMany(solutionsArray, {ordered: false})

    console.log(`File Sync Completed at: ${new Date().toISOString()}`)
    const endTime = Date.now()
    console.log(`Time Taken to Sync Files = ${Math.ceil((endTime - startTime)/1000)} seconds`)

    solutionStatUpdate() 

  }catch(err){
    console.log('ERROR: syncAllSolutions()')
    console.log(err)
  }
}

module.exports = { syncAllSolutions }