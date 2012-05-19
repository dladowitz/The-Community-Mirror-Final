var RepliesSchema = new Schema({
  yes: Number,
  no : Number,
  date: Date,
  //dbref to question
  question:{type:Schema.ObjectId, ref:'Questions'}
});

mongoose.model('Replies', RepliesSchema);
