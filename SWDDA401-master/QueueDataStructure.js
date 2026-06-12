/**
 * Queue Data Structure Implementation
 * A Queue is a linear data structure that follows FIFO (First In First Out) principle
 * Elements are added at the rear and removed from the front
 */

/**
 * Node Class
 * Represents a single node/element in the queue.
 * Each node contains data and a reference to the next node.
 */
class Node {
  /**
   * Constructor for Node
   * @param {*} data - The value/data to be stored in the node
   */
  constructor(data) {
    this.data = data;    // Stores the actual data/value
    this.next = null;    // Initially points to null (no next node)
  }
}

/**
 * Queue Class (Linked List Implementation)
 * Manages a sequence of nodes following FIFO principle.
 * Maintains references to both front (head) and rear (tail) for efficient operations.
 */
class Queue {
  /**
   * Constructor for Queue
   * Initializes an empty queue with no nodes
   */
  constructor() {
    this.front = null;   // Points to the first node in the queue
    this.rear = null;    // Points to the last node in the queue
    this.size = 0;       // Tracks the number of elements
  }

  /**
   * Enqueue (Add to rear)
   * Adds a new element to the end (rear) of the queue.
   * Time Complexity: O(1) - Constant time
   * @param {*} data - The data to be added to the queue
   */
  enqueue(data) {
    const newNode = new Node(data);

    if (this.rear === null) {
      // Queue is empty
      this.front = newNode;
      this.rear = newNode;
    } else {
      // Add to the rear
      this.rear.next = newNode;
      this.rear = newNode;
    }

    this.size++;
  }

  /**
   * Dequeue (Remove from front)
   * Removes and returns the element from the front of the queue.
   * Follows FIFO principle - first element added is first to be removed.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The data of the removed element, or null if queue is empty
   */
  dequeue() {
    if (this.front === null) {
      console.log("Queue is empty");
      return null;
    }

    const dequeuedData = this.front.data;
    this.front = this.front.next;
    this.size--;

    if (this.front === null) {
      this.rear = null;
    }

    return dequeuedData;
  }

  /**
   * Peek at front
   * Returns the element at the front without removing it.
   * Useful to see what will be dequeued next.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The data at the front, or null if queue is empty
   */
  peekFront() {
    return this.front === null ? null : this.front.data;
  }

  /**
   * Peek at rear
   * Returns the element at the rear without removing it.
   * Shows the most recently added element.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The data at the rear, or null if queue is empty
   */
  peekRear() {
    return this.rear === null ? null : this.rear.data;
  }

  /**
   * Check if the queue is empty
   * Determines whether the queue contains any elements.
   * Time Complexity: O(1) - Constant time
   * @returns {boolean} True if queue is empty, false otherwise
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Get the size of the queue
   * Returns the total number of elements in the queue.
   * Time Complexity: O(1) - Constant time (size is tracked)
   * @returns {number} The number of elements in the queue
   */
  getSize() {
    return this.size;
  }

  /**
   * Clear the entire queue
   * Removes all elements by resetting front and rear to null.
   * The garbage collector will clean up the removed nodes.
   * Time Complexity: O(1) - Constant time
   */
  clear() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  /**
   * Search for an element
   * Checks if a value exists in the queue.
   * Returns true as soon as the element is found.
   * Time Complexity: O(n) - Linear, worst case searches entire queue
   * @param {*} data - The value to search for
   * @returns {boolean} True if element found, false otherwise
   */
  search(data) {
    let current = this.front;

    while (current) {
      if (current.data === data) {
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Get element at a specific position
   * Returns the data at the specified index (0-based from front).
   * Time Complexity: O(n) - Linear, traverses to the position
   * @param {number} position - The index to access (0-based, 0 is front)
   * @returns {*} The data at the position, or null if out of bounds
   */
  getElementAt(position) {
    if (position < 0 || position >= this.size) {
      return null;
    }

    let current = this.front;
    let count = 0;

    while (current && count < position) {
      current = current.next;
      count++;
    }

    return current ? current.data : null;
  }

  /**
   * Display all elements
   * Prints the queue in a readable format: front [elem1 -> elem2 -> elem3] rear
   * Shows the order of elements from front to rear.
   * Time Complexity: O(n) - Linear, traverses entire queue
   */
  display() {
    if (this.front === null) {
      console.log("Queue: []");
      return;
    }

    let result = "Queue: [";
    let current = this.front;

    while (current) {
      result += current.data;
      if (current.next) result += " -> ";
      current = current.next;
    }

    result += "]";
    console.log(result);
  }

  /**
   * Display with indicators
   * Shows the queue with clear front and rear indicators.
   * Helpful for visualizing FIFO operations.
   * Time Complexity: O(n) - Linear, traverses entire queue
   */
  displayWithIndicators() {
    if (this.front === null) {
      console.log("Queue: Empty");
      return;
    }

    let result = "Front -> ";
    let current = this.front;

    while (current) {
      result += current.data;
      if (current.next) result += " -> ";
      current = current.next;
    }

    result += " <- Rear";
    console.log(result);
  }

  /**
   * Convert to array
   * Creates and returns a JavaScript array containing all queue elements.
   * Maintains the order from front to rear.
   * Time Complexity: O(n) - Linear, traverses entire queue
   * @returns {Array} Array containing all elements from front to rear
   */
  toArray() {
    const arr = [];
    let current = this.front;

    while (current) {
      arr.push(current.data);
      current = current.next;
    }

    return arr;
  }

  /**
   * Reverse the queue
   * Reverses the order of all elements in the queue.
   * Time Complexity: O(n) - Linear, visits each node once
   */
  reverse() {
    let previous = null;
    let current = this.front;
    this.rear = this.front;

    while (current) {
      const next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }

    this.front = previous;
  }

  /**
   * Rotate queue to the right
   * Moves the rear element to the front k times.
   * Time Complexity: O(n*k) - For k rotations
   * @param {number} k - Number of positions to rotate
   */
  rotateRight(k) {
    if (this.size === 0 || k === 0) return;

    k = k % this.size; // Optimize for k larger than size

    for (let i = 0; i < k; i++) {
      const rearData = this.dequeue();
      this.enqueue(rearData);
    }
  }

  /**
   * Rotate queue to the left
   * Moves the front element to the rear k times.
   * Time Complexity: O(n*k) - For k rotations
   * @param {number} k - Number of positions to rotate
   */
  rotateLeft(k) {
    if (this.size === 0 || k === 0) return;

    k = k % this.size; // Optimize for k larger than size

    for (let i = 0; i < k; i++) {
      const frontData = this.dequeue();
      this.enqueue(frontData);
    }
  }

  /**
   * Check if value exists (contains)
   * Determines if a specific value is in the queue.
   * Time Complexity: O(n) - Linear search
   * @param {*} data - The value to check
   * @returns {boolean} True if value exists, false otherwise
   */
  contains(data) {
    return this.search(data);
  }

  /**
   * Count occurrences of a value
   * Returns how many times a value appears in the queue.
   * Time Complexity: O(n) - Searches through all elements
   * @param {*} data - The value to count
   * @returns {number} Number of occurrences
   */
  countOccurrences(data) {
    let count = 0;
    let current = this.front;

    while (current) {
      if (current.data === data) {
        count++;
      }
      current = current.next;
    }

    return count;
  }

  /**
   * Remove all occurrences of a value
   * Deletes all instances of the specified value from the queue.
   * Time Complexity: O(n) - Traverses entire queue
   * @param {*} data - The value to remove
   * @returns {number} Number of elements removed
   */
  removeAllOccurrences(data) {
    let count = 0;
    let current = this.front;
    let previous = null;

    while (current) {
      if (current.data === data) {
        if (previous === null) {
          this.front = current.next;
        } else {
          previous.next = current.next;
        }

        if (current === this.rear) {
          this.rear = previous;
        }

        current = current.next;
        this.size--;
        count++;
      } else {
        previous = current;
        current = current.next;
      }
    }

    return count;
  }

  /**
   * Duplicate queue
   * Creates and returns a copy of the current queue.
   * The new queue is independent of the original.
   * Time Complexity: O(n) - Must traverse and copy all elements
   * @returns {Queue} A new queue with the same elements
   */
  duplicate() {
    const newQueue = new Queue();
    let current = this.front;

    while (current) {
      newQueue.enqueue(current.data);
      current = current.next;
    }

    return newQueue;
  }

  /**
   * Get all elements at once
   * Similar to toArray but uses a different approach.
   * Time Complexity: O(n) - Traverses entire queue
   * @returns {Array} Array of all elements
   */
  getAllElements() {
    return this.toArray();
  }

  /**
   * Compare with another queue
   * Checks if two queues have the same elements in the same order.
   * Time Complexity: O(n) - Compares all elements
   * @param {Queue} otherQueue - The queue to compare with
   * @returns {boolean} True if queues are identical, false otherwise
   */
  isEqual(otherQueue) {
    if (this.size !== otherQueue.size) {
      return false;
    }

    let current1 = this.front;
    let current2 = otherQueue.front;

    while (current1) {
      if (current1.data !== current2.data) {
        return false;
      }
      current1 = current1.next;
      current2 = current2.next;
    }

    return true;
  }

  /**
   * Print queue status
   * Displays detailed information about the queue.
   * Time Complexity: O(n) - Traverses entire queue
   */
  printStatus() {
    console.log("=== Queue Status ===");
    console.log("Size:", this.size);
    console.log("Is Empty:", this.isEmpty());
    console.log("Front Element:", this.peekFront());
    console.log("Rear Element:", this.peekRear());
    console.log("Elements:", this.toArray());
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== QUEUE DATA STRUCTURE =====\n");

// Create a new queue
const queue = new Queue();

// Enqueue elements
console.log("1. Enqueuing elements (10, 20, 30, 40, 50):");
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
queue.enqueue(40);
queue.enqueue(50);
queue.displayWithIndicators();
console.log("   Size:", queue.getSize());

// Peek operations
console.log("\n2. Peek operations:");
console.log("   Front element:", queue.peekFront());
console.log("   Rear element:", queue.peekRear());

// Dequeue elements
console.log("\n3. Dequeue elements (FIFO - First In First Out):");
console.log("   Dequeued:", queue.dequeue());
queue.displayWithIndicators();
console.log("   Dequeued:", queue.dequeue());
queue.displayWithIndicators();

// Search
console.log("\n4. Search operations:");
console.log("   Search for 30:", queue.search(30));
console.log("   Search for 100:", queue.search(100));
console.log("   Contains 40?", queue.contains(40));

// Get element at position
console.log("\n5. Get element at position:");
console.log("   Element at position 0:", queue.getElementAt(0));
console.log("   Element at position 1:", queue.getElementAt(1));
console.log("   Element at position 5:", queue.getElementAt(5));

// Size and empty check
console.log("\n6. Queue properties:");
console.log("   Size:", queue.getSize());
console.log("   Is empty?", queue.isEmpty());

// Convert to array
console.log("\n7. Convert to array:");
console.log("   Array representation:", queue.toArray());

// Reverse
console.log("\n8. Reverse the queue:");
queue.reverse();
queue.displayWithIndicators();

// Rotate left
console.log("\n9. Rotate left by 2:");
const queue2 = new Queue();
[10, 20, 30, 40, 50].forEach(val => queue2.enqueue(val));
console.log("   Before rotation:");
queue2.displayWithIndicators();
queue2.rotateLeft(2);
console.log("   After rotating left by 2:");
queue2.displayWithIndicators();

// Rotate right
console.log("\n10. Rotate right by 2:");
const queue3 = new Queue();
[10, 20, 30, 40, 50].forEach(val => queue3.enqueue(val));
console.log("    Before rotation:");
queue3.displayWithIndicators();
queue3.rotateRight(2);
console.log("    After rotating right by 2:");
queue3.displayWithIndicators();

// Count occurrences
console.log("\n11. Count occurrences:");
const queue4 = new Queue();
[10, 20, 20, 30, 30, 30, 40].forEach(val => queue4.enqueue(val));
console.log("    Queue:", queue4.toArray());
console.log("    Occurrences of 20:", queue4.countOccurrences(20));
console.log("    Occurrences of 30:", queue4.countOccurrences(30));
console.log("    Occurrences of 50:", queue4.countOccurrences(50));

// Remove all occurrences
console.log("\n12. Remove all occurrences:");
const queue5 = new Queue();
[10, 20, 20, 30, 30, 30, 40, 40].forEach(val => queue5.enqueue(val));
console.log("    Before removing 30's:");
queue5.displayWithIndicators();
const removed = queue5.removeAllOccurrences(30);
console.log("    After removing 30's (removed:", removed, "):");
queue5.displayWithIndicators();

// Duplicate queue
console.log("\n13. Duplicate queue:");
const originalQueue = new Queue();
[10, 20, 30, 40, 50].forEach(val => originalQueue.enqueue(val));
console.log("    Original queue:");
originalQueue.displayWithIndicators();
const duplicatedQueue = originalQueue.duplicate();
console.log("    Duplicated queue:");
duplicatedQueue.displayWithIndicators();
console.log("    Are they equal?", originalQueue.isEqual(duplicatedQueue));

// Queue status
console.log("\n14. Queue status:");
const statusQueue = new Queue();
[5, 15, 25, 35].forEach(val => statusQueue.enqueue(val));
statusQueue.printStatus();

// Clear queue
console.log("\n15. Clear the queue:");
const clearQueue = new Queue();
[1, 2, 3, 4, 5].forEach(val => clearQueue.enqueue(val));
console.log("    Before clearing:");
clearQueue.displayWithIndicators();
clearQueue.clear();
console.log("    After clearing:");
clearQueue.displayWithIndicators();
console.log("    Is empty?", clearQueue.isEmpty());

// Simulating real-world scenario: Bank queue
console.log("\n16. Real-world example - Bank Queue Simulation:");
const bankQueue = new Queue();
console.log("    Customers arriving at bank...");
bankQueue.enqueue("Customer 1");
bankQueue.enqueue("Customer 2");
bankQueue.enqueue("Customer 3");
bankQueue.enqueue("Customer 4");
bankQueue.displayWithIndicators();

console.log("\n    Serving customers (FIFO):");
for (let i = 0; i < 3; i++) {
  const served = bankQueue.dequeue();
  console.log("    Serving:", served);
  if (!bankQueue.isEmpty()) {
    bankQueue.displayWithIndicators();
  }
}

console.log("\n    New customer arriving...");
bankQueue.enqueue("Customer 5");
bankQueue.displayWithIndicators();

// Priority queue concept (demonstration)
console.log("\n17. Priority handling example:");
const serviceQueue = new Queue();
serviceQueue.enqueue({ name: "John", priority: "normal" });
serviceQueue.enqueue({ name: "Jane", priority: "normal" });
serviceQueue.enqueue({ name: "VIP Member", priority: "high" });

console.log("    Service queue:");
let current = serviceQueue.front;
while (current) {
  console.log(`    - ${current.data.name} (${current.data.priority})`);
  current = current.next;
}

console.log("\n===== END OF QUEUE EXAMPLES =====");
