import { t } from "elysia";

const password = t.String({
  minLength: 8,
  maxLength: 32,
});

export { password as passwordValidation };
