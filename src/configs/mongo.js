import mongoose from 'mongoose';
import environments from './environments.js';

function connect() {
  return mongoose.connect(environments.MONGO_URI);
}

export default connect;