import TSON, { IValidation } from "typia"
import { BadReqError } from "./http-error";


export const validateBody = <T>(closure: (input: unknown) => IValidation<T>) => (body: unknown) => { 
    const result = closure(body)
    if(!result.success){
        throw new BadReqError(TSON.stringify(result.errors));
    }

    return result.data
 }
