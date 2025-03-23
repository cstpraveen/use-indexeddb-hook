# use-indexeddb-hook

A React hook to interact with IndexedDB.

## Demo
[CodeSandbox Demo](https://codesandbox.io/p/sandbox/vfttxg)

## Feature Requests
Have a feature request? I'm listening! Please open an issue on GitHub using the following link, and I'll do my best to implement it within a day.

[Raise a Feature Request](https://github.com/cstpraveen/use-indexeddb-hook/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=Feature+Request%3A+)

## Installation

```bash
npm install use-indexeddb-hook
```

## Usage

```bash
import React from "react";
import useIndexedDB from "use-indexeddb-hook";

const App = () => {
  const { db, error, addRecord, getAllRecords } = useIndexedDB("MyDB", "MyStore");

  const handleAddRecord = async () => {
    await addRecord({ name: "Test Record" });
    const records = await getAllRecords();
    console.log(records);
  };

  return (
    <div>
      <button onClick={handleAddRecord}>Add Record</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default App;
```

## IndexedDB Operations

This section describes the available operations for interacting with the IndexedDB database.

* **`db`**: The IndexedDB database instance.
* **`error`**: Any error that occurs during database operations.

### Record Management

The following functions provide functionality for managing records within the IndexedDB store:

* **`addRecord(record)`**: Adds a new record to the store. The `record` parameter should be an object representing the data to be stored.
* **`updateRecord(record)`**: Updates an existing record in the store. The `record` parameter should be an object containing the updated data.
* **`deleteRecord(id)`**: Deletes a record from the store based on its `id`.
* **`getAllRecords()`**: Retrieves all records currently stored in the IndexedDB store.
* **`getRecordById(id)`**: Retrieves a single record from the store based on its `id`.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.