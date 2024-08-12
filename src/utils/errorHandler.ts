export function handleError(err: unknown) {
  if (err instanceof Error) {
    return {
      errors: {
        _form: [err.message],
      },
    };
  } else {
    return {
      errors: {
        _form: ['Something went wrong'],
      },
    };
  }
}