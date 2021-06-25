// declaring database
let db;

// creating a request for budgets database
const request = indexedDB.open("budgetDB", 1);

request.onupgradeneeded = (event) => {
    // creating object store called "pending" and setting autoIncrement to true
    const db = event.target.result;
    db.createObjectStore("pending", {
        autoIncrement: true
    });
};

request.onsuccess = (event) => {
    db = event.target.result;

    // checking if app is online before reading from db
    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = (event) => {
    console.log("Chaos Reigns!!!! " + event.target.errorCode);
};

function saveRecord(record) {
    // creating a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
    // accessing pending object store
    const store = transaction.objectStore("pending");
    // adding record to pending object store
    store.add(record);
}

function checkDatabase() {
    // opening a transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // accessing pending object store
    const store = transaction.objectStore("pending");
    // geting all records from store and setting to variable "allRecords"
    const allRecords = store.getAll();

    allRecords.onsuccess = function () {
        if (allRecords.result.length > 0) {
            fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(allRecords.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(() => {
                    // if successful, opening a transaction on pending db
                    const transaction = db.transaction(["pending"], "readwrite");
                    // accessing pending object store
                    const store = transaction.objectStore("pending");

                    // clearing all items in store
                    store.clear();
                });
        }
    };
}

// listening for app coming back online
window.addEventListener("online", checkDatabase);