import { jest, 
        expect, 
        describe, 
        test,
        beforeEach } from "@jest/globals";

import config from "../../../server/config.js";
import { Controller } from "../../../server/controller.js";
import { handler } from "../../../server/routes.js";
import TestUtil from "../_util/testUtil.js";

const {
    pages,
    location,
    constants: {
        CONTENT_TYPE
    }
} = config;

describe('#Routes - test site for api response', ()=>{
    beforeEach(()=>{
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });
    test('GET / - should redirect to home page', async ()=>{
        const params = TestUtil.defaultHandleParams();
        
        params.request.method = "GET";
        params.request.url = "/";

        await handler(...params.values());
        expect(params.response.writeHead).toBeCalledWith(
            302,
            {
                'Location': location.home
            }
        );
        expect(params.response.end).toHaveBeenCalled();
    });
    test( `GET /home - should response with ${pages.homeHTML} file stream`, async ()=>{
        const params = TestUtil.defaultHandleParams();
        const mockFileStream = TestUtil.generateReadbleStream(['data']);

        params.request.method = "GET";
        params.request.url = "/home";

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
        });

        jest.spyOn(
            mockFileStream,
            "pipe",
        ).mockResolvedValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });
    test( `GET /controller - should response with ${pages.controllerHTML} file stream`, async()=>{
        const params = TestUtil.defaultHandleParams();
        const mockFileStream = TestUtil.generateReadbleStream(['data']);

        params.request.method = "GET";
        params.request.url = "/controller";

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
        });

        jest.spyOn(
            mockFileStream,
            "pipe",
        ).mockResolvedValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith(pages.controllerHTML);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });
    test( `GET /index.html - should response with file stream`, async()=>{
        const params = TestUtil.defaultHandleParams();
        const fileName = '/index.html';
        const mockFileStream = TestUtil.generateReadbleStream(['data']);
        const expectedType = '.html';

        params.request.method = "GET";
        params.request.url = fileName;

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        });

        jest.spyOn(
            mockFileStream,
            "pipe",
        ).mockResolvedValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith(fileName);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).toHaveBeenCalledWith(
            200,
            {
                'Content-Type': CONTENT_TYPE[expectedType]
            }
        );
    });
    test( `GET /file.ext - should response with file stream`, async()=>{
        const params = TestUtil.defaultHandleParams();
        const fileName = '/file.ext';
        const mockFileStream = TestUtil.generateReadbleStream(['data']);
        const expectedType = '.ext';

        params.request.method = "GET";
        params.request.url = fileName;

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name,
        ).mockResolvedValue({
            stream: mockFileStream,
            type: expectedType
        });

        jest.spyOn(
            mockFileStream,
            "pipe",
        ).mockResolvedValue();

        await handler(...params.values());
        expect(Controller.prototype.getFileStream).toBeCalledWith(fileName);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).not.toHaveBeenCalled();
    });
    test( `GET /unknown - given an inexistent route should response with 404`, async()=>{
        const params = TestUtil.defaultHandleParams();
        const fileName = '/unknown';

        params.request.method = "GET";
        params.request.url = fileName;

        await handler(...params.values());
         
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalled();
    });
    describe('exceptions', ()=>{
        test('given inexistent file it should respond with 404', async ()=>{
            const params = TestUtil.defaultHandleParams();
            const fileName = '/index.png';

            params.request.method = "GET";
            params.request.url = fileName;

            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name,
            ).mockRejectedValue(new Error('Error: ENOENT: no such file or directy '));

            await handler(...params.values());
            
            expect(params.response.writeHead).toHaveBeenCalledWith(404);
            expect(params.response.end).toHaveBeenCalled();
        });
        test('given an error it should respond with 500', async ()=>{
            const params = TestUtil.defaultHandleParams();
            const fileName = '/index.png';

            params.request.method = "GET";
            params.request.url = fileName;

            jest.spyOn(
                Controller.prototype,
                Controller.prototype.getFileStream.name,
            ).mockRejectedValue(new Error('Error:'));

            await handler(...params.values());
            
            expect(params.response.writeHead).toHaveBeenCalledWith(500);
            expect(params.response.end).toHaveBeenCalled();
        });
    });
});
