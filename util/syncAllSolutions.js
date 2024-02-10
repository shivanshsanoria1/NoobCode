const path = require('path')
const fs = require('fs')

const Solution = require('../models/solutionModel')

async function storeFiles(solutionsDirPath, file){
  return new Promise(async (resolve, reject) => {
    try{
      const solutionFilePath = path.join(solutionsDirPath, file)

      const quesId = parseInt(file.split('.')[0])
      const title = (file.split('.')[1]).split('_').join(' ')
      const fileExtension = path.extname(solutionFilePath)
      const isAccepted = file.search('TLE') === -1
      //console.log(`${quesId} ${title} ${fileExtension} ${isAccepted}`)

      const fileData = fs.readFileSync(solutionFilePath, 'utf8')

      let solution = await Solution.findOne({ quesId })

      if(!solution){ // add a new solution
        solution = new Solution({
          quesId,
          title,
          fileExtension,
          acceptedSolutions: [],
          unacceptedSolutions: []
        })
        
        if(isAccepted){
          solution.acceptedSolutions.push(fileData)
        }else{
          solution.unacceptedSolutions.push(fileData)
        }

      }else{ // update already existing solution
        solution.quesId = quesId
        solution.title = title
        solution.fileExtension = fileExtension

        if(isAccepted){
          solution.acceptedSolutions = [...solution.acceptedSolutions, fileData]
          //console.log(solution.acceptedSolutions)
        }else{
          solution.unacceptedSolutions = [...solution.unacceptedSolutions, fileData]
          //console.log(solution.unAcceptedSolutions)
        }

      }
      await solution.save()
      //console.log(solution.quesId)
      
      resolve()
    }catch(err){
      console.log(err)
      reject()
    }
  })
}


exports.syncAllSolutions = async () => {
  try{
    const solutionsDirPath = path.join(__dirname, '..', 'LeetcodeSolutions')
    //console.log(solutionsDirPath)

    const files = fs.readdirSync(solutionsDirPath)
    
    for(const file of files){
      await storeFiles(solutionsDirPath, file)
    }
  }catch(err){
    console.log('SOLUTION SYNC FAILED')
    console.log(err)
  }
}
