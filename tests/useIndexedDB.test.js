import { renderHook, act } from "@testing-library/react-hooks";
import useIndexedDB from "../src/useIndexedDB";

describe("useIndexedDB", () => {
  const dbName = "TestDB";
  const storeName = "TestStore";

  beforeAll(() => {
    // Mock IndexedDB
    // eslint-disable-next-line no-unused-vars
    jest.spyOn(indexedDB, "open").mockImplementation((name, version) => {
      const request = {
        onupgradeneeded: null,
        onsuccess: null,
        onerror: null,
        result: {
          createObjectStore: jest.fn(),
          transaction: jest.fn(() => ({
            objectStore: jest.fn(() => ({
              add: jest.fn(),
              put: jest.fn(),
              delete: jest.fn(),
              getAll: jest.fn(),
              get: jest.fn(),
            })),
          })),
          close: jest.fn(),
        },
        error: null,
      };
      setTimeout(() => request.onsuccess?.({ target: request }), 0);
      return request;
    });
  });

  it("should initialize the database", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useIndexedDB(dbName, storeName)
    );
    await waitForNextUpdate();
    expect(result.current.db).toBeDefined();
  });

  it("should add a record", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useIndexedDB(dbName, storeName)
    );
    await waitForNextUpdate();
    await act(async () => {
      await result.current.addRecord({ name: "Test Record" });
    });
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useIndexedDB(dbName, storeName)
    );
    await waitForNextUpdate();
    jest.spyOn(result.current.db, "transaction").mockImplementation(() => {
      throw new Error("Test Error");
    });
    await act(async () => {
      await result.current.addRecord({ name: "Test Record" });
    });
    expect(result.current.error).toBeDefined();
  });
});