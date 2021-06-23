// declaring database
let db;

// creating a request for budgets database
const request = indexedDB.open("budgets", 1);

request.onupgradeneeded = (event) => {
    // creating object store called "pending" and setting autoIncrement to true
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
  };