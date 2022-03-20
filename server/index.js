import server from "./server";
import { logger } from "./util.js";
import config from "./config.js";

console.log(config)
server.listen(config.port)
.on('listening', ()=> logger.info(`Server running at ${config.port}!!`));