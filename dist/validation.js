"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateUserCreation = exports.validateTodoUpdate = exports.validateTodoCreation = exports.validateMongoId = exports.validateLogin = exports.createRateLimiter = void 0;
var _authutil = require("./authutil.js");
// Validation middleware factory
const createValidationMiddleware = validationRules => {
  return (req, res, next) => {
    const errors = [];
    for (const rule of validationRules) {
      const {
        field,
        validator,
        message,
        required = true,
        sanitize = false
      } = rule;
      const value = req.body[field];

      // Check if field is required
      if (required && (value === undefined || value === null || value === '')) {
        errors.push(`${field}: ${message || 'This field is required'}`);
        continue;
      }

      // Skip validation if field is optional and empty
      if (!required && (value === undefined || value === null || value === '')) {
        continue;
      }

      // Sanitize input if needed
      if (sanitize && typeof value === 'string') {
        req.body[field] = (0, _authutil.sanitizeString)(value);
      }

      // Validate field
      if (!validator(value)) {
        errors.push(`${field}: ${message || 'Invalid format'}`);
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: errors
      });
    }
    next();
  };
};

// Specific validation middlewares
const validateUserCreation = exports.validateUserCreation = createValidationMiddleware([{
  field: 'id',
  validator: _authutil.validateEmail,
  message: 'Valid email address is required',
  sanitize: true
}, {
  field: 'username',
  validator: _authutil.validateUsername,
  message: 'Username must be 2-50 characters with letters, numbers, spaces, and Korean characters only',
  sanitize: true
}, {
  field: 'password',
  validator: _authutil.validatePassword,
  message: 'Password must be at least 6 characters long'
}]);
const validateLogin = exports.validateLogin = createValidationMiddleware([{
  field: 'id',
  validator: _authutil.validateEmail,
  message: 'Valid email address is required',
  sanitize: true
}, {
  field: 'password',
  validator: password => typeof password === 'string' && password.length > 0,
  message: 'Password is required'
}]);
const validateTodoCreation = exports.validateTodoCreation = createValidationMiddleware([{
  field: 'todo',
  validator: _authutil.validateTodo,
  message: 'Todo must be 1-200 characters long',
  sanitize: true
}, {
  field: 'desc',
  validator: _authutil.validateDescription,
  message: 'Description must be less than 1000 characters',
  required: false,
  sanitize: true
}]);
const validateTodoUpdate = exports.validateTodoUpdate = createValidationMiddleware([{
  field: 'todo',
  validator: _authutil.validateTodo,
  message: 'Todo must be 1-200 characters long',
  sanitize: true
}, {
  field: 'desc',
  validator: _authutil.validateDescription,
  message: 'Description must be less than 1000 characters',
  required: false,
  sanitize: true
}, {
  field: 'done',
  validator: value => typeof value === 'boolean',
  message: 'Done must be a boolean value'
}]);

// ID parameter validation
const validateMongoId = (req, res, next) => {
  const {
    id
  } = req.params;
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Valid ID parameter is required'
    });
  }

  // Sanitize ID
  req.params.id = (0, _authutil.sanitizeString)(id);
  next();
};

// Rate limiting helper (basic implementation)
exports.validateMongoId = validateMongoId;
const createRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const clients = new Map();
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    if (!clients.has(clientIp)) {
      clients.set(clientIp, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    const client = clients.get(clientIp);
    if (now > client.resetTime) {
      client.count = 1;
      client.resetTime = now + windowMs;
      return next();
    }
    if (client.count >= maxRequests) {
      return res.status(429).json({
        status: 'fail',
        message: 'Too many requests. Please try again later.'
      });
    }
    client.count++;
    next();
  };
};
exports.createRateLimiter = createRateLimiter;