import { logger } from "./util.js";
import config from "./config.js";
import { Controller } from "./controller.js";

const {
    location,
    pages: {
        homeHTML,
        controllerHTML
    },
    constants: {
        CONTENT_TYPE
    }
} = config;
const controller = new Controller();

async function routes(request, response){
    const { method, url } = request;

    if(method === "GET" && url === "/"){
        response.writeHead(302,{
            "Location": location.home
        });

        return response.end();
    }   
    if(method === "GET" && url === "/home"){
        const {
            stream
        } = await controller.getFileStream(homeHTML);

        // response.whiteHead(200, {
        //     'Content-Type': 'text/html'
        // });
        
        return stream.pipe(response);
    }

    if(method === "GET" && url === "/controller"){
        const {
            stream
        } = await controller.getFileStream(controllerHTML);

        // response.whiteHead(200, {
        //     'Content-Type': 'text/html'
        // });
        
        return stream.pipe(response);
    }

    if(method === 'GET'){
        const{  
            stream,
            type
        } = await controller.getFileStream(url);

        const content_type = CONTENT_TYPE[type] ;

        if(content_type){
            response.whiteHead(200, {
                'Content-Type': content_type    
            });
        }

        return stream.pipe(response);
    }
    response.writeHead(404);
    return response.end();
}

function handleError(error, response){
    if(error.message.includes('ENOENT')){
        logger.warn(`asset not found ${error}`);
        response.writeHead(404);
        return response.end(); 
    }

    logger.error(`caught error on API ${error.stack}`);
    response.writeHead(500);
    return response.end();
}

export function handler(request, response){
    return routes(request, response).catch(error => {
        logger.error(handleError(error, response));
    })
}