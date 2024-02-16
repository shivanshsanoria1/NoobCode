const path = require('path')
const fs = require('fs')

const Solution = require('../models/solution')
const SolutionStat = require('../models/SolutionStat')

async function storeFiles(solutionsDirPath, fileName){
  return new Promise(async (resolve, reject) => {
    try{
      const solutionFilePath = path.join(solutionsDirPath, fileName)

      const quesId = parseInt(fileName.split('.')[0])
      const title = fileName.split('.')[1].split(' ')[0].split('_').join(' ')
      const language = path.extname(solutionFilePath).substring(1)
      const isAccepted = fileName.search('TLE') === -1
      const fileNameWithoutExt = fileName.split('.')[1]
      const version = parseInt(fileNameWithoutExt[fileNameWithoutExt.length - 2])

      const fileData = fs.readFileSync(solutionFilePath, 'utf8')

      let solution = await Solution.findOne({ quesId })

      if(!solution){ // add a new solution
        solution = new Solution({
          quesId,
          title,
          language,
          acceptedSolutions: [],
          unacceptedSolutions: []
        })
        
        if(isAccepted){
          solution.acceptedSolutions[version - 1] = fileData
        }else{
          solution.unacceptedSolutions[version - 1] = fileData
        }
      }else{ // update already existing solution
        solution.quesId = quesId
        solution.title = title
        solution.language = language

        if(isAccepted){
          solution.acceptedSolutions[version - 1] = fileData
        }else{
          solution.unacceptedSolutions[version - 1] =  fileData
        }
      }
      
      await solution.save()
      resolve()
    }catch(err){
      console.log(err)
      reject()
    }
  })
}

async function solutionStatUpdate(){
  try{
    const startTime = Date.now()
    console.log(`File Stat Update Started at: ${new Date().toISOString()}`)

    let solutionStat = await SolutionStat.findOne({})
    
    const countCPP = await Solution.countDocuments({ language: 'cpp' })
    const countJS = await Solution.countDocuments({ language: 'js' })
    const countSQL = await Solution.countDocuments({ language: 'sql' })

    if(!solutionStat){ // create a new solution stat document
      solutionStat = new SolutionStat({ countCPP, countJS, countSQL })

    }else{ // update an already existing solution stat document
      solutionStat.countCPP = countCPP
      solutionStat.countJS = countJS
      solutionStat.countSQL = countSQL
    }

    await solutionStat.save()

    console.log(`File Stat Update Completed at: ${new Date().toISOString()}`)
    const endTime = Date.now()
    console.log(`Time Taken to Update File Stats = ${Math.ceil((endTime - startTime)/1000)} seconds`)    

  }catch(err){
    console.log('SOLUTION STAT UPDATE FAILED')
    console.log(err)
  }
}

exports.syncAllSolutions = async () => {
  try{
    
    const startTime = Date.now()
    console.log(`File Sync Started at: ${new Date().toISOString()}`)

    const solutionsDirPath_cpp = path.join(__dirname, '..', 'LeetcodeSolutions', 'cpp')
    const solutionsDirPath_js = path.join(__dirname, '..', 'LeetcodeSolutions', 'js')
    const solutionsDirPath_sql = path.join(__dirname, '..', 'LeetcodeSolutions', 'sql')

    const solutionsDirPaths = [solutionsDirPath_cpp, solutionsDirPath_js, solutionsDirPath_sql]

    for(solutionsDirPath of solutionsDirPaths){
      const fileNames = fs.readdirSync(solutionsDirPath)
    
      for(const fileName of fileNames){
        await storeFiles(solutionsDirPath, fileName)
      }
    }

    console.log(`File Sync Completed at: ${new Date().toISOString()}`)
    const endTime = Date.now()
    console.log(`Time Taken to Sync Files = ${Math.ceil((endTime - startTime)/1000)} seconds`)

    solutionStatUpdate() 
  }catch(err){
    console.log('SOLUTION SYNC FAILED')
    console.log(err)
  }
}
