const HTTTP_STATUS_CODE = {
  // Informational responses (100–199)
  INFORMATIONAL: {
    CONTINUE: 100, // Request received, continue process.
    SWITCHING_PROTOCOLS: 101, // Switching to a different protocol.
    PROCESSING: 102, // WebDAV; processing request.
    EARLY_HINTS: 103 // Return hints before the final HTTP message.
  },

  // Successful responses (200–299)
  SUCCESS: {
    OK: 200, // Request succeeded.
    CREATED: 201, // Resource created successfully.
    ACCEPTED: 202, // Request accepted but not yet processed.
    NON_AUTHORITATIVE_INFORMATION: 203, // Returned meta-information not from origin server.
    NO_CONTENT: 204, // Successful request but no content returned.
    RESET_CONTENT: 205, // Reset content for further inputs.
    PARTIAL_CONTENT: 206, // Partial content returned.
    MULTI_STATUS: 207, // WebDAV; multi-status message.
    ALREADY_REPORTED: 208, // WebDAV; member already reported.
    IM_USED: 226 // HTTP Delta encoding.
  },

  // Redirection messages (300–399)
  REDIRECTION: {
    MULTIPLE_CHOICES: 300, // Multiple options for the resource.
    MOVED_PERMANENTLY: 301, // Resource moved permanently.
    FOUND: 302, // Resource temporarily moved.
    SEE_OTHER: 303, // Redirect to another resource.
    NOT_MODIFIED: 304, // Resource not modified since last request.
    TEMPORARY_REDIRECT: 307, // Temporary redirect to a new resource.
    PERMANENT_REDIRECT: 308 // Permanent redirect to a new resource.
  },

  // Client error responses (400–499)
  CLIENT_ERROR: {
    BAD_REQUEST: 400, // Server cannot process malformed request.
    UNAUTHORIZED: 401, // Authentication required.
    PAYMENT_REQUIRED: 402, // Reserved for future use.
    FORBIDDEN: 403, // Client does not have permission.
    NOT_FOUND: 404, // Resource not found.
    METHOD_NOT_ALLOWED: 405, // HTTP method not allowed.
    NOT_ACCEPTABLE: 406, // Cannot fulfill request based on Accept header.
    PROXY_AUTHENTICATION_REQUIRED: 407, // Proxy authentication required.
    REQUEST_TIMEOUT: 408, // Request timed out.
    CONFLICT: 409, // Request conflict with current state.
    GONE: 410, // Resource permanently removed.
    LENGTH_REQUIRED: 411, // Content-Length header required.
    PRECONDITION_FAILED: 412, // Precondition given in headers failed.
    PAYLOAD_TOO_LARGE: 413, // Payload size too large.
    URI_TOO_LONG: 414, // URI too long for server to process.
    UNSUPPORTED_MEDIA_TYPE: 415, // Unsupported media type in request.
    RANGE_NOT_SATISFIABLE: 416, // Range not satisfiable for resource.
    EXPECTATION_FAILED: 417, // Expectation in request cannot be met.
    IM_A_TEAPOT: 418, // Fun RFC joke; I'm a teapot!
    MISDIRECTED_REQUEST: 421, // Request was directed to wrong server.
    UNPROCESSABLE_ENTITY: 422, // WebDAV; semantic error in request.
    LOCKED: 423, // WebDAV; resource is locked.
    FAILED_DEPENDENCY: 424, // WebDAV; dependent request failed.
    TOO_EARLY: 425, // Prevent replay attacks.
    UPGRADE_REQUIRED: 426, // Upgrade protocol required.
    PRECONDITION_REQUIRED: 428, // Preconditions required.
    TOO_MANY_REQUESTS: 429, // Too many requests sent in a given time.
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431, // Header fields too large.
    UNAVAILABLE_FOR_LEGAL_REASONS: 451 // Blocked for legal reasons.
  },

  // Server error responses (500–599)
  SERVER_ERROR: {
    INTERNAL_SERVER_ERROR: 500, // Generic server error.
    NOT_IMPLEMENTED: 501, // Server does not support functionality.
    BAD_GATEWAY: 502, // Invalid response from upstream server.
    SERVICE_UNAVAILABLE: 503, // Server unavailable (overload/maintenance).
    GATEWAY_TIMEOUT: 504, // Upstream server timed out.
    HTTP_VERSION_NOT_SUPPORTED: 505, // HTTP version not supported.
    VARIANT_ALSO_NEGOTIATES: 506, // Variant negotiation error.
    INSUFFICIENT_STORAGE: 507, // WebDAV; insufficient storage.
    LOOP_DETECTED: 508, // WebDAV; infinite loop detected.
    NOT_EXTENDED: 510, // Further extensions required.
    NETWORK_AUTHENTICATION_REQUIRED: 511 // Network authentication required.
  }
}

export default HTTTP_STATUS_CODE
