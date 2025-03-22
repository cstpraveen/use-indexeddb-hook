import { useEffect, useState } from "react";

const useIndexedDB = (dbName, storeName, version = 1) => {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

  // Open or create the database
  useEffect(() => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      setDb(event.target.result);
    };

    request.onerror = (event) => {
      setError(`Error opening database: ${event.target.error}`);
    };

    // Cleanup on unmount
    return () => {
      if (db) {
        db.close();
      }
    };
  }, [dbName, storeName, version]);

  // Add a record to the store
  const addRecord = async (record) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.add(record);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(`Error adding record: ${event.target.error}`);
    });
  };

  // Update a record in the store
  const updateRecord = async (record) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.put(record);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(`Error updating record: ${event.target.error}`);
    });
  };

  // Delete a record from the store
  const deleteRecord = async (id) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(`Error deleting record: ${event.target.error}`);
    });
  };

  // Get all records from the store
  const getAllRecords = async () => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(`Error fetching records: ${event.target.error}`);
    });
  };

  // Get a single record by ID
  const getRecordById = async (id) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject("Database not initialized");
        return;
      }

      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(`Error fetching record: ${event.target.error}`);
    });
  };

  return {
    db,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    getAllRecords,
    getRecordById,
  };
};

export default useIndexedDB;