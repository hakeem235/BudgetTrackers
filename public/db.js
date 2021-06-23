// declaring database
let db;

// creating a request for budgets database
const request = indexedDB.open("budgetDB", 1);

request.onupgradeneeded = (event) => {
    // creating object store called "pending" and setting autoIncrement to true
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
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