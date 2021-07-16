const mongoose = require('mongoose');
const topicschema  = new mongoose.Schema(
    {
        top : {
            type : String,
        }
    }
);

topicschema.statics.check = async function(top)
{
  const topic = await this.findOne({top});
  if(topic)
  {
      return topic._id;
  }
}
   

const Topic = mongoose.model('topic', topicschema);
module.exports = Topic;
