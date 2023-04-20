import type { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/ban-types

export type ControllerHandle = <TRequest extends Request, TResponse extends Response, TNextFunction extends NextFunction>(req: TRequest, res: TResponse, next: TNextFunction) => Promise<any>
export const controllerHandler = (fn: ControllerHandle) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
