var QuestionSchema = new Schema({
  text: String,
  date: Date,
  last_update: Date,
  yes:Number,
  no:Number,
  total:Number,
  request_ids:[Number],
  user:{type:Schema.ObjectId, ref:'Users'},
  replies:[]

});

mongoose.model('Questions', QuestionSchema);
