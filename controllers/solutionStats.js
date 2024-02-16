const SolutionStat = require('../models/SolutionStat')

exports.getSolutionStats = async(req, res) => {
  try{
    const { countCPP, countJS, countSQL } = await SolutionStat.findOne({})

    res.status(200).json({
      cpp: countCPP,
      js: countJS,
      sql: countSQL
    })
    
  }catch(err){
    console.log(err)
    res.status(500).json({ msg: 'Something went wrong' })
  }
}