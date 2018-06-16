var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
 
  headline: {
    type: String,
    required: true,
    unique:true
  },
  
  summary: {
    type: String,
   
  },
 
  link: {
    type: String,
   
  },
  isSaved:{
    type:Boolean,
    default:false
  },
  createdDate:{
    type:Date,
    default:Date.now
  },
 
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
   }]
});


var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;