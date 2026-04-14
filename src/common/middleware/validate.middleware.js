import ApiError from "../utils/api-error";

const validate = (DtoClass) => {
    return (req, _, next) => {
        const {errors, value} = DtoClass.validateData(req.body);
        if(errors){
            throw ApiError.badRequest(errors.join("; "))
        }

        req.body = value
        next()
    }
}

export default validate