const Solution = require('../models/solution')

exports.getSolution = async (req, res) => {
  try{
    const ques_id = parseInt(req.params.ques_id)
    if(isNaN(ques_id)){
      res.status(400).json({ msg: 'Invalid Question Number' })
      return
    }
    
    const solution = await Solution.findOne({ quesId: ques_id })

    if(!solution){
        res.status(200).json({ 
          found: false, 
          msg: "solution not found :("
        })
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
    res.status(500).json({ msg: 'Something went wrong' })
  }
}