export const logger = {
  info: (message: string) => {
    console.log(`🟢 [INFO]: ${message}`);
  },

  error: (message: string, stack?: any) => {
    console.error(`🔴 [ERROR]: ${message}`);
    if (stack) console.error(stack);
  },
};
