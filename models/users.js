var UserSchema = new Schema({
  username: String,
  fname:String,
  lname:String,
  type: Number,
  admin: Number,
  facebook_id: String,
  email: String,
  date: Date,
  timezone:Number,
  totalResponses:Number,
  totalQuestions:Number,
  questions:[{type: Schema.ObjectId, ref:'Questions'}]
});

mongoose.model('Users', UserSchema);
