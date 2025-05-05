

// Open (or create) the IndexedDB database.
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SessionDB", 1);

    // This event fires when the database is created or upgraded.
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Create an object store named "sessionStore" with a key path "id".
      if (!db.objectStoreNames.contains("sessionStore")) {
        db.createObjectStore("sessionStore", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Save a session (or any object) into the "sessionStore"
async function setSession(key, value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessionStore", "readwrite");
    const store = transaction.objectStore("sessionStore");
    // Here, `value` can be any object including Blobs.
    const request = store.put({ id: key, data: value });
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}

// Retrieve a session from the "sessionStore"
async function getSession(key) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("sessionStore", "readonly");
    const store = transaction.objectStore("sessionStore");
    const request = store.get(key);
    request.onsuccess = (event) => {
      // event.target.result is an object like { id: key, data: value }
      resolve(event.target.result ? event.target.result.data : null);
    };
    request.onerror = (event) => reject(event.target.error);
  });
}

// Example usage:
(async () => {
  // Saving a session object (could include blobs, chat data, etc.)
  const sessionData = {
    chats: [
      { chatId: "123", messages: [{ type: "user", content: "Hello" }] }
    ],
    lastUpdated: Date.now()
  };

  try {
    await setSession("currentSession", sessionData);
    console.log("Session saved successfully!");

    // Later, retrieve the session.
    const loadedSession = await getSession("currentSession");
    console.log("Loaded session:", loadedSession);
  } catch (error) {
    console.error("Error handling session in IndexedDB:", error);
  }
})();
