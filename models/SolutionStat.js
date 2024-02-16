const { Schema, model } = require('mongoose')

const solutionStatSchema = new Schema({
  countCPP:{
    type: Number,
    default: 0
  },
  countJS:{
    type: Number,
    default: 0
  },
  countSQL:{
    type: Number,
    default: 0
  },
}, {
  timestamps: true
})

module.exports = model('SolutionStat', solutionStatSchema)