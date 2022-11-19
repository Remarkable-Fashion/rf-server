/* eslint-disable max-classes-per-file */

// type ObjectType = Record<any, string> | undefined;

const HTTP_STATUS_CODE = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORIZE: 401,
    NOT_FOUND: 404,
    DUPLICATE: 409,
    INTERNAL_SERVER: 500
} as const;

export class HttpError extends Error {
    status: number;

    // objects: ObjectType[] | undefined;

    constructor(status: number, message?: string) {
        super(message);
        const { name, prototype } = new.target;

        Object.setPrototypeOf(this, prototype);
        this.name = name;
        this.status = status;
        // this.objects = objects;
    }
}

export class BadReqError extends HttpError {
    constructor(message?: string) {
        super(HTTP_STATUS_CODE.BAD_REQUEST, message);
        const { name, prototype } = new.target;

        Object.setPrototypeOf(this, prototype);
        this.name = name;
    }
}

export class NotFoundError extends HttpError {
    constructor(message?: string) {
        super(HTTP_STATUS_CODE.NOT_FOUND, message);
        const { name, prototype } = new.target;

        Object.setPrototypeOf(this, prototype);
        this.name = name;
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message?: string) {
        super(HTTP_STATUS_CODE.UN_AUTHORIZE, message);
        const { name, prototype } = new.target;

        Object.setPrototypeOf(this, prototype);
        this.name = name;
    }
}
