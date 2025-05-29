import { t } from "elysia";

export const errorResponseDto = {
  400: t.Object({
    name: t.Literal("BadRequestError"),
    message: t.String(),
  }),
  401: t.Object({
    name: t.Literal("UnauthorizedError"),
    message: t.String(),
  }),
  402: t.Object({
    name: t.Literal("PaymentRequiredError"),
    message: t.String(),
  }),
  403: t.Object({
    name: t.Literal("ForbiddenError"),
    message: t.String(),
  }),
  404: t.Object({
    name: t.Literal("NotFoundError"),
    message: t.String(),
  }),
  405: t.Object({
    name: t.Literal("MethodNotAllowedError"),
    message: t.String(),
  }),
  406: t.Object({
    name: t.Literal("NotAcceptableError"),
    message: t.String(),
  }),
  407: t.Object({
    name: t.Literal("ProxyAuthenticationRequiredError"),
    message: t.String(),
  }),
  408: t.Object({
    name: t.Literal("RequestTimeoutError"),
    message: t.String(),
  }),
  409: t.Object({
    name: t.Literal("ConflictError"),
    message: t.String(),
  }),
  410: t.Object({
    name: t.Literal("GoneError"),
    message: t.String(),
  }),
  411: t.Object({
    name: t.Literal("LengthRequiredError"),
    message: t.String(),
  }),
  412: t.Object({
    name: t.Literal("PreconditionFailedError"),
    message: t.String(),
  }),
  413: t.Object({
    name: t.Literal("PayloadTooLargeError"),
    message: t.String(),
  }),
  414: t.Object({
    name: t.Literal("URITooLongError"),
    message: t.String(),
  }),
  415: t.Object({
    name: t.Literal("UnsupportedMediaTypeError"),
    message: t.String(),
  }),
  416: t.Object({
    name: t.Literal("RangeNotSatisfiableError"),
    message: t.String(),
  }),
  417: t.Object({
    name: t.Literal("ExpectationFailedError"),
    message: t.String(),
  }),
  418: t.Object({
    name: t.Literal("ImATeapotError"),
    message: t.String(),
  }),
  421: t.Object({
    name: t.Literal("MisdirectedRequestError"),
    message: t.String(),
  }),
  422: t.Object({
    name: t.Literal("UnprocessableEntityError"),
    message: t.String(),
    details: t.Object({
      type: t.String(),
      fields: t.Array(
        t.Object({
          summary: t.String(),
          type: t.Number(),
          schema: t.Any(),
          path: t.String(),
          value: t.Any(),
          message: t.String(),
        })
      ),
    }),
  }),
  423: t.Object({
    name: t.Literal("LockedError"),
    message: t.String(),
  }),
  424: t.Object({
    name: t.Literal("FailedDependencyError"),
    message: t.String(),
  }),
  425: t.Object({
    name: t.Literal("TooEarlyError"),
    message: t.String(),
  }),
  426: t.Object({
    name: t.Literal("UpgradeRequiredError"),
    message: t.String(),
  }),
  428: t.Object({
    name: t.Literal("PreconditionRequiredError"),
    message: t.String(),
  }),
  429: t.Object({
    name: t.Literal("TooManyRequestsError"),
    message: t.String(),
  }),
  431: t.Object({
    name: t.Literal("RequestHeaderFieldsTooLargeError"),
    message: t.String(),
  }),
  451: t.Object({
    name: t.Literal("UnavailableForLegalReasonsError"),
    message: t.String(),
  }),
  500: t.Object({
    name: t.Literal("InternalServerError"),
    message: t.String(),
  }),
  501: t.Object({
    name: t.Literal("NotImplementedError"),
    message: t.String(),
  }),
  502: t.Object({
    name: t.Literal("BadGatewayError"),
    message: t.String(),
  }),
  503: t.Object({
    name: t.Literal("ServiceUnavailableError"),
    message: t.String(),
  }),
  504: t.Object({
    name: t.Literal("GatewayTimeoutError"),
    message: t.String(),
  }),
  505: t.Object({
    name: t.Literal("HTTPVersionNotSupportedError"),
    message: t.String(),
  }),
  506: t.Object({
    name: t.Literal("VariantAlsoNegotiatesError"),
    message: t.String(),
  }),
  507: t.Object({
    name: t.Literal("InsufficientStorageError"),
    message: t.String(),
  }),
  508: t.Object({
    name: t.Literal("LoopDetectedError"),
    message: t.String(),
  }),
  509: t.Object({
    name: t.Literal("BandwidthLimitExceededError"),
    message: t.String(),
  }),
  510: t.Object({
    name: t.Literal("NotExtendedError"),
    message: t.String(),
  }),
  511: t.Object({
    name: t.Literal("NetworkAuthenticationRequiredError"),
    message: t.String(),
  }),
};
