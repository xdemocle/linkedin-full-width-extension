// Type definitions for Jest
declare const jest: {
  fn: () => jest.Mock<any, any>;
  clearAllMocks: () => void;
  mock: (moduleName: string, factory?: any) => void;
};

declare namespace jest {
  interface Mock<T = any, Y extends any[] = any[]> extends Function {
    (...args: Y): T;
    mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockImplementationOnce: (fn: (...args: Y) => T) => Mock<T, Y>;
    mockReturnValue: (value: T) => Mock<T, Y>;
    mockReturnValueOnce: (value: T) => Mock<T, Y>;
    mockResolvedValue: (value: T) => Mock<T, Y>;
    mockResolvedValueOnce: (value: T) => Mock<T, Y>;
    mockRejectedValue: (value: any) => Mock<T, Y>;
    mockRejectedValueOnce: (value: any) => Mock<T, Y>;
  }
}

declare function describe(name: string, fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
declare function expect(value: any): {
  toBe: (expected: any) => void;
  toEqual: (expected: any) => void;
  toContain: (expected: any) => void;
  not: {
    toBe: (expected: any) => void;
    toEqual: (expected: any) => void;
    toContain: (expected: any) => void;
    toBeNull: () => void;
    toHaveBeenCalled: () => void;
  };
  toBeNull: () => void;
  toHaveBeenCalled: () => void;
  toHaveBeenCalledWith: (...args: any[]) => void;
};
