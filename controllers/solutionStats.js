const SolutionStat = require('../models/SolutionStat')

exports.getSolutionStats = async(req, res) => {
  try{
    const { countCPP, countJS, countSQL, partialCountCPP, quesIds } = await SolutionStat.findOne({})

    res.status(200).json({
      countCPP,
      countJS,
      countSQL,
      partialCountCPP,
      quesIds
    })
    
  }catch(err){
    console.log('ERROR: getSolutionStats()')
    console.log(err)
    res.status(500).json({ 
      msg: 'Something went wrong' 
    })
  }
}