const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const questionschema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        linkto:
        {
            type: String,
        },
        topic: {
            type: Schema.Types.ObjectId,
            ref: 'topics'
        }
    }
)
const Question = mongoose.model('question',questionschema);
module.exports = Question;


