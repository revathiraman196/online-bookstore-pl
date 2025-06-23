// jest.setup.ts
global.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
