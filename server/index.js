import { httpServerHandler } from 'cloudflare:node';
import app from './app.js';

const PORT = process.env.PORT || 5000;
app.listen(PORT);

export default httpServerHandler({ port: PORT });
