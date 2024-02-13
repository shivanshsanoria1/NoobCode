const { Schema, model } = require('mongoose')

const solutionSchema = new Schema({
  quesId: {
    type: Number,
    index: true,
    required: true,
  },
  title: {
    type: String,
    maxLength: 100,
    lowercase: true,
    required: true
  },
  language: {
    type: String,
    maxLength: 10,
    lowercase: true,
    required: true
  },
  acceptedSolutions: [{
    type: String
  }],
  unacceptedSolutions : [{
    type: String
  }],
  createdAt: {
    type: Date,
    immutable: true,
    default: () => new Date()
  },
  updatedAt:{
    type: Date,
    default: () => new Date()
  }
})

/* solutionSchema.methods.getAcceptedSolutions = () => {
  const acceptedSolutions = this.acceptedSolutions.map((sol) => {
    return {
      id: sol._id.toString(),
      quesId: sol.quesId,
      title: sol.title,
      fileExtension: sol.fileExtension,
    }
  })
  return acceptedSolutions
} */


module.exports = model('Solution', solutionSchema)