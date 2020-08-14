'use strict'
class Exception extends Error {
    constructor(message, code, statusCode, data) {
        super(message);
        this.statusCode = statusCode || 500;
        this.status = this.statusCode
        this.code = code || this.statusCode;
        this.data = data;
    }
}
class BusinessException extends Exception {
    constructor(message, code) {
        if (!code) code = -1
        super(message, code, 400);
    }
}
class NotFoundException extends Exception {
    constructor(message, code) {
        super(message, 404, 404);
    }
}

/**
 * 通用异常类
 * @class exception
 */
class exception extends Exception {
    /**
     * 资源未找到的异常
     * @param {string} 异常消息
     * @returns {NotFoundException} 返回异常消息对象。statusCode 是返回给客户端的状态码；code 是业务错误码，默认与状态码相同；message 是返回给客户端的消息。
     */
    static NotFound(msg, code) {
        return new NotFoundException(msg, code);
    }

    /**
         * 常规业务异常
         * @param {string} 异常消息
         * @returns {BusinessException} 返回异常消息对象。statusCode 是返回给客户端的状态码；code 是业务错误码，默认与状态码相同；message 是返回给客户端的消息。
         */
    static BusinessException(msg, code) {
        return new BusinessException(msg, code);
    }
    /**
            * 网络异常
            * @param {string} 异常消息
            * @returns {Exception} 返回异常消息对象。statusCode 是返回给客户端的状态码；code 是业务错误码，默认与状态码相同；message 是返回给客户端的消息。
            */
    static NetWorkException(msg, code, statusCode) {
        return new Exception(msg, code, statusCode);
    }

    /**
     * 微服务接口异常(除了401, 404, >=500 其它都返回200)
     * @param {*} msg 
     * @param {*} code 
     * @param {*} statusCode 
     */
    static InterfaceException(msg, code, statusCode) {
        if (statusCode == 401 || statusCode == 404 || statusCode >= 500)
            return new Exception(msg, code, statusCode);
        return new Exception(msg, -1, 200);
    }

    /**
     * 权限异常
     * @param {*} msg 
     * @param {*} code 
     * @param {*} statusCode 
     */
    static PermissionException(msg, code) {
        return new Exception(msg, code, 401);
    }
}
module.exports = exception;


