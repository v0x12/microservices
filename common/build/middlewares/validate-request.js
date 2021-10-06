"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
var validation_error_1 = require("../errors/validation-error");
var express_validator_1 = require("express-validator");
var validateRequest = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        throw new validation_error_1.RequestValidationError(errors.array());
    }
    next();
};
exports.validateRequest = validateRequest;
