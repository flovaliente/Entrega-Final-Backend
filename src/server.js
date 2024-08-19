import app from './app.js';
import dotenv from 'dotenv';
import { init } from './socket.js';

dotenv.config();

const PORT = process.env.PORT || 8080;
const serverHttp = app.listen(PORT, () =>{
  console.log(`Server running in http://localhost:${PORT}/`);
});

init(serverHttp)