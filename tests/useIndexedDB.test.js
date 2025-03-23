import React from 'react';
import { render, act, waitFor } from "@testing-library/react";
import useIndexedDB from "../src/useIndexedDB";

// Custom renderHook function for testing hooks
const renderHook = (callback) => {
  let result;
  const TestComponent = () => {
    result = callback();
    return null;
  };
  render(<TestComponent />);
  return { result };
};

describe("useIndexedDB", () => {
  const dbName = "TestDB";
  const storeName = "TestStore";

  beforeAll(() => {
    if (!window.indexedDB) {
      window.indexedDB = {};
    }
    if (!window.indexedDB.open) {
      window.indexedDB.open = jest.fn();
    }

    jest.spyOn(window.indexedDB, "open").mockImplementation((name, version) => {
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
    const { result } = renderHook(() => useIndexedDB(dbName, storeName));
    await waitFor(() => expect(result.db).toBeDefined());
  });

  it("should add a record", async () => {
    const { result } = renderHook(() => useIndexedDB(dbName, storeName));
    await waitFor(() => expect(result.db).toBeDefined());
    //add a small timeout.
    await waitFor(()=> expect(result.loading).toBe(false));

    await act(async () => {
      await result.addRecord({ name: "Test Record" });
    });
    expect(result.error).toBeNull();
  });

  it("should handle errors", async () => {
    const { result } = renderHook(() => useIndexedDB(dbName, storeName));
    await waitFor(() => expect(result.db).toBeDefined());
    await waitFor(()=> expect(result.loading).toBe(false));

    jest.spyOn(result.db, "transaction").mockImplementation(() => {
      throw new Error("Test Error");
    });
    await act(async () => {
      await result.addRecord({ name: "Test Record" });
    });
    expect(result.error).toBeDefined();
  });
});