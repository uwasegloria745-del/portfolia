/**
 * Hash Table Data Structure Implementation
 * A hash table provides fast key-value storage using a hashing function.
 * This implementation uses separate chaining with linked lists for collision handling.
 */

/**
 * HashNode Class
 * Represents a single key-value pair stored in the hash table.
 */
class HashNode {
  /**
   * Constructor for HashNode
   * @param {*} key - The key for the data
   * @param {*} value - The value associated with the key
   */
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
  }
}

/**
 * HashTable Class
 * Implements a hash table with insertion, lookup, deletion, and collision handling.
 */
class HashTable {
  /**
   * Constructor for HashTable
   * @param {number} capacity - Initial bucket capacity (default: 16)
   */
  constructor(capacity = 16) {
    this.capacity = capacity;
    this.size = 0;
    this.buckets = new Array(capacity).fill(null);
  }

  /**
   * Hash function for keys
   * Converts a key to a numeric index using character codes.
   * Time Complexity: O(k) where k is key length
   * @param {*} key - The key to hash
   * @returns {number} Bucket index
   */
  hash(key) {
    const strKey = String(key);
    let hash = 0;

    for (let i = 0; i < strKey.length; i++) {
      hash = (hash << 5) - hash + strKey.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }

    return Math.abs(hash) % this.capacity;
  }

  /**
   * Insert or update a key-value pair
   * Handles collisions using separate chaining.
   * Time Complexity: O(1) average, O(n) worst case
   * @param {*} key - The key to insert or update
   * @param {*} value - The value to associate with the key
   */
  put(key, value) {
    const index = this.hash(key);
    let node = this.buckets[index];

    while (node !== null) {
      if (node.key === key) {
        node.value = value;
        return;
      }
      node = node.next;
    }

    const newNode = new HashNode(key, value);
    newNode.next = this.buckets[index];
    this.buckets[index] = newNode;
    this.size++;

    if (this.size / this.capacity > 0.75) {
      this.resize(this.capacity * 2);
    }
  }

  /**
   * Retrieve the value for a key
   * Searches the bucket's linked list for the key.
   * Time Complexity: O(1) average, O(n) worst case
   * @param {*} key - The key to lookup
   * @returns {*} The value, or undefined if key not found
   */
  get(key) {
    const index = this.hash(key);
    let node = this.buckets[index];

    while (node !== null) {
      if (node.key === key) {
        return node.value;
      }
      node = node.next;
    }

    return undefined;
  }

  /**
   * Remove a key-value pair
   * Removes the node from the bucket's linked list.
   * Time Complexity: O(1) average, O(n) worst case
   * @param {*} key - The key to remove
   * @returns {*} The removed value, or undefined if key not found
   */
  remove(key) {
    const index = this.hash(key);
    let node = this.buckets[index];
    let prev = null;

    while (node !== null) {
      if (node.key === key) {
        if (prev === null) {
          this.buckets[index] = node.next;
        } else {
          prev.next = node.next;
        }
        this.size--;
        return node.value;
      }
      prev = node;
      node = node.next;
    }

    return undefined;
  }

  /**
   * Check if a key exists
   * Time Complexity: O(1) average, O(n) worst case
   * @param {*} key - The key to check
   * @returns {boolean} True if key exists, false otherwise
   */
  containsKey(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Get the number of key-value pairs stored
   * Time Complexity: O(1)
   * @returns {number} The size of the hash table
   */
  getSize() {
    return this.size;
  }

  /**
   * Check if hash table is empty
   * Time Complexity: O(1)
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Resize hash table capacity
   * Rehashes all existing entries into a larger bucket array.
   * Time Complexity: O(n)
   * @param {number} newCapacity - The new bucket capacity
   */
  resize(newCapacity) {
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = new Array(newCapacity).fill(null);
    this.size = 0;

    for (let bucket of oldBuckets) {
      let node = bucket;
      while (node !== null) {
        this.put(node.key, node.value);
        node = node.next;
      }
    }
  }

  /**
   * Get all keys in the hash table
   * Time Complexity: O(n)
   * @returns {Array} Array of keys
   */
  keys() {
    const result = [];
    for (let bucket of this.buckets) {
      let node = bucket;
      while (node !== null) {
        result.push(node.key);
        node = node.next;
      }
    }
    return result;
  }

  /**
   * Get all values in the hash table
   * Time Complexity: O(n)
   * @returns {Array} Array of values
   */
  values() {
    const result = [];
    for (let bucket of this.buckets) {
      let node = bucket;
      while (node !== null) {
        result.push(node.value);
        node = node.next;
      }
    }
    return result;
  }

  /**
   * Clear the entire hash table
   * Removes all key-value pairs and resets the buckets.
   * Time Complexity: O(n)
   */
  clear() {
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  /**
   * Print hash table status
   * Displays the load factor, size, capacity, and bucket distribution.
   * Time Complexity: O(n)
   */
  printStatus() {
    console.log("=== Hash Table Status ===");
    console.log("Size:", this.size);
    console.log("Capacity:", this.capacity);
    console.log("Load Factor:", (this.size / this.capacity).toFixed(2));
    console.log("Keys:", this.keys());
    console.log("Values:", this.values());
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== HASH TABLE DATA STRUCTURE =====\n");

const hashTable = new HashTable();

console.log("1. Insert key-value pairs:");
hashTable.put('name', 'Alice');
hashTable.put('age', 30);
hashTable.put('country', 'USA');
hashTable.put('job', 'Engineer');
console.log("   Keys:", hashTable.keys());
console.log("   Values:", hashTable.values());
console.log("   Size:", hashTable.getSize());

console.log("\n2. Retrieve values:");
console.log("   name:", hashTable.get('name'));
console.log("   age:", hashTable.get('age'));
console.log("   unknown:", hashTable.get('unknown'));

console.log("\n3. Update value for existing key:");
hashTable.put('age', 31);
console.log("   age:", hashTable.get('age'));

console.log("\n4. Check if key exists:");
console.log("   country exists:", hashTable.containsKey('country'));
console.log("   city exists:", hashTable.containsKey('city'));

console.log("\n5. Remove a key:");
console.log("   Removed value:", hashTable.remove('job'));
console.log("   Keys after removal:", hashTable.keys());
console.log("   Size:", hashTable.getSize());

console.log("\n6. Load factor and resizing:");
for (let i = 1; i <= 20; i++) {
  hashTable.put(`key${i}`, `value${i}`);
}
console.log("   Size after inserts:", hashTable.getSize());
console.log("   Capacity after resizing:", hashTable.capacity);
console.log("   Load factor:", (hashTable.getSize() / hashTable.capacity).toFixed(2));

console.log("\n7. Print status:");
hashTable.printStatus();

console.log("\n8. Clear hash table:");
hashTable.clear();
console.log("   Size after clear:", hashTable.getSize());
console.log("   Is empty:", hashTable.isEmpty());

console.log("\n===== END OF HASH TABLE EXAMPLES =====");
