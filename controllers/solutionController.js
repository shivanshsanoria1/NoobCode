const Solution = require('../models/solutionModel')

exports.getSolution = async (req, res) => {
  try{
    const ques_id = parseInt(req.params.ques_id)
    if(isNaN(ques_id)){
      res.status(400).json({ msg: 'Invalid Question Number' })
      return
    }
    
    const solution = await Solution.findOne({ quesId: ques_id })

    if(!solution){
        res.status(200).json({ msg: "solution not found :("})
        return
    }

    const { quesId, title, language, acceptedSolutions, unacceptedSolutions } = solution

    res.status(200).json({
      quesId,
      title,
      language,
      acceptedSolutions,
      unacceptedSolutions
    })

  }catch(err){
    console.log('ERROR: solution not found')
    console.log(err)
  }
}