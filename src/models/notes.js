'use strict';

import mongoose from 'mongoose';

const NotesSchema = mongoose.Schema({
  title: {type:String},
  note: {type:String},
  date: {type:Date, default:Date.now},
});

export default mongoose.model('notes', NotesSchema);