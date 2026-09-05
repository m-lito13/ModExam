export class IdempotencyConflictError extends Error {
  readonly statusCode = 409;

  constructor(idempotencyKey: string) {
    super(`Idempotency-Key "${idempotencyKey}" was already used with different order details`);
    this.name = 'IdempotencyConflictError';
  }
}
