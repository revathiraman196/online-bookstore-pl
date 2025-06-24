import type { Middleware } from '@reduxjs/toolkit';

export const loggingMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  if (typeof action === 'object' && action !== null && 'type' in action) {
    console.log('[Action]', action.type, action);
  }

  return next(action);
};
