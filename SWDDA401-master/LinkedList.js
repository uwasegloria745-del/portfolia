/**
 * Node Class
 * Represents a single node/element in the linked list.
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
 * LinkedList Class
 * Manages a sequence of nodes where each node links to the next.
 * Maintains references to both head (first) and tail (last) nodes for efficient operations.
 */
class LinkedList {
  /**
   * Constructor for LinkedList
   * Initializes an empty linked list with no nodes
   */
  constructor() {
    this.head = null;    // Points to the first node in the list
    this.tail = null;    // Points to the last node in the list
  }

  /**
   * Insert at the beginning (head)
   * Adds a new node with the given data at the start of the list.
   * Time Complexity: O(1) - Constant time
   * @param {*} data - The data to be inserted
   */
  insertAtBeginning(data) {
    const newNode = new Node(data);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
  }

  /**
   * Insert at the end (tail)
   * Adds a new node with the given data at the end of the list.
   * Time Complexity: O(1) - Constant time (due to tail pointer)
   * @param {*} data - The data to be inserted
   */
  insertAtEnd(data) {
    const newNode = new Node(data);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  /**
   * Insert at a specific position
   * Adds a new node at the specified index (0-based indexing).
   * Validates position before insertion.
   * Time Complexity: O(n) - Linear, needs to traverse to the position
   * @param {*} data - The data to be inserted
   * @param {number} position - The index where data should be inserted (0-based)
   */
  insertAtPosition(data, position) {
    if (position < 0) {
      console.log("Position cannot be negative");
      return;
    }

    if (position === 0) {
      this.insertAtBeginning(data);
      return;
    }

    const newNode = new Node(data);
    let current = this.head;
    let previous;
    let count = 0;

    while (current && count < position) {
      previous = current;
      current = current.next;
      count++;
    }

    if (count !== position) {
      console.log("Position out of bounds");
      return;
    }

    newNode.next = current;
    previous.next = newNode;

    if (newNode.next === null) {
      this.tail = newNode;
    }
  }

  /**
   * Delete from the beginning (head)
   * Removes the first node and returns its data.
   * Updates tail if it was the only node.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The data of the deleted node, or null if list is empty
   */
  deleteFromBeginning() {
    if (this.head === null) {
      console.log("List is empty");
      return null;
    }

    const deletedData = this.head.data;
    this.head = this.head.next;

    if (this.head === null) {
      this.tail = null;
    }

    return deletedData;
  }

  /**
   * Delete from the end (tail)
   * Removes the last node and returns its data.
   * Must traverse to find the second-to-last node.
   * Time Complexity: O(n) - Linear, needs to traverse entire list
   * @returns {*} The data of the deleted node, or null if list is empty
   */
  deleteFromEnd() {
    if (this.head === null) {
      console.log("List is empty");
      return null;
    }

    if (this.head === this.tail) {
      const deletedData = this.head.data;
      this.head = null;
      this.tail = null;
      return deletedData;
    }

    let current = this.head;
    let previous;

    while (current.next !== null) {
      previous = current;
      current = current.next;
    }

    const deletedData = current.data;
    previous.next = null;
    this.tail = previous;

    return deletedData;
  }

  /**
   * Delete from a specific position
   * Removes the node at the specified index (0-based).
   * Validates position before deletion.
   * Time Complexity: O(n) - Linear, needs to traverse to the position
   * @param {number} position - The index of the node to delete (0-based)
   * @returns {*} The data of the deleted node, or null if position is invalid
   */
  deleteFromPosition(position) {
    if (position < 0) {
      console.log("Position cannot be negative");
      return null;
    }

    if (this.head === null) {
      console.log("List is empty");
      return null;
    }

    if (position === 0) {
      return this.deleteFromBeginning();
    }

    let current = this.head;
    let previous;
    let count = 0;

    while (current && count < position) {
      previous = current;
      current = current.next;
      count++;
    }

    if (current === null) {
      console.log("Position out of bounds");
      return null;
    }

    const deletedData = current.data;
    previous.next = current.next;

    if (previous.next === null) {
      this.tail = previous;
    }

    return deletedData;
  }

  /**
   * Delete by value
   * Finds and removes the first node containing the specified data.
   * Updates tail pointer if the last node was deleted.
   * Time Complexity: O(n) - Linear, searches through list
   * @param {*} data - The value of the node to delete
   * @returns {boolean} True if node was deleted, false if not found
   */
  deleteByValue(data) {
    if (this.head === null) {
      console.log("List is empty");
      return false;
    }

    if (this.head.data === data) {
      return this.deleteFromBeginning() !== null;
    }

    let current = this.head;
    let previous = null;

    while (current) {
      if (current.data === data) {
        previous.next = current.next;
        if (current === this.tail) {
          this.tail = previous;
        }
        return true;
      }
      previous = current;
      current = current.next;
    }

    return false;
  }

  /**
   * Search for an element
   * Checks if a value exists in the linked list.
   * Returns true as soon as the element is found.
   * Time Complexity: O(n) - Linear, worst case searches entire list
   * @param {*} data - The value to search for
   * @returns {boolean} True if element found, false otherwise
   */
  search(data) {
    let current = this.head;

    while (current) {
      if (current.data === data) {
        return true;
      }
      current = current.next;
    }

    return false;
  }

  /**
   * Find element at a specific position
   * Returns the data at the specified index (0-based).
   * Returns null if position is out of bounds.
   * Time Complexity: O(n) - Linear, traverses to the position
   * @param {number} position - The index to access (0-based)
   * @returns {*} The data at the position, or null if out of bounds
   */
  getElementAt(position) {
    if (position < 0 || this.head === null) {
      return null;
    }

    let current = this.head;
    let count = 0;

    while (current && count < position) {
      current = current.next;
      count++;
    }

    return current ? current.data : null;
  }

  /**
   * Get the size of the linked list
   * Counts and returns the total number of nodes.
   * Time Complexity: O(n) - Linear, must traverse entire list
   * @returns {number} The total number of nodes in the list
   */
  size() {
    let count = 0;
    let current = this.head;

    while (current) {
      count++;
      current = current.next;
    }

    return count;
  }

  /**
   * Check if the list is empty
   * Determines whether the linked list contains any nodes.
   * Time Complexity: O(1) - Constant time
   * @returns {boolean} True if list is empty, false otherwise
   */
  isEmpty() {
    return this.head === null;
  }

  /**
   * Clear the entire list
   * Removes all nodes by resetting head and tail to null.
   * The garbage collector will clean up the removed nodes.
   * Time Complexity: O(1) - Constant time
   */
  clear() {
    this.head = null;
    this.tail = null;
  }

  /**
   * Reverse the linked list
   * Reverses the direction of all node pointers.
   * The head becomes the tail and vice versa.
   * Uses three pointers: previous, current, and next.
   * Time Complexity: O(n) - Linear, visits each node once
   */
  reverse() {
    let previous = null;
    let current = this.head;
    this.tail = this.head;

    while (current) {
      const next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }

    this.head = previous;
  }

  /**
   * Display all elements
   * Prints the linked list in a readable format: data1 -> data2 -> ... -> null
   * Time Complexity: O(n) - Linear, traverses entire list
   */
  display() {
    let current = this.head;
    let result = "";

    while (current) {
      result += current.data + " -> ";
      current = current.next;
    }

    result += "null";
    console.log(result);
  }

  /**
   * Convert to array
   * Creates and returns a JavaScript array containing all list elements.
   * Useful for quick iteration or integration with array methods.
   * Time Complexity: O(n) - Linear, traverses entire list
   * @returns {Array} Array containing all elements from the list
   */
  toArray() {
    const arr = [];
    let current = this.head;

    while (current) {
      arr.push(current.data);
      current = current.next;
    }

    return arr;
  }

  /**
   * Get the first element
   * Returns the data of the head node.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The data of the first node, or null if list is empty
   */
  getFirst() {
    return this.head ? this.head.data : null;
  }

  /**
   * Get the last element
   * Returns the data of the tail node.
   * Time Complexity: O(1) - Constant time (due to tail pointer)
   * @returns {*} The data of the last node, or null if list is empty
   */
  getLast() {
    return this.tail ? this.tail.data : null;
  }

  /**
   * Find the middle element
   * Uses the two-pointer technique (tortoise and hare algorithm).
   * Slow pointer moves 1 step, fast pointer moves 2 steps.
   * When fast reaches end, slow is at the middle.
   * Time Complexity: O(n) - Linear, but only one traversal
   * @returns {*} The data of the middle node, or null if list is empty
   */
  getMiddle() {
    if (this.head === null) {
      return null;
    }

    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }

    return slow.data;
  }

  /**
   * Check if list has a cycle (Floyd's Cycle Detection Algorithm)
   * Uses two pointers: slow (1 step) and fast (2 steps).
   * If they meet, a cycle exists. If fast reaches null, no cycle.
   * This is the optimal cycle detection algorithm.
   * Time Complexity: O(n) - Linear, single traversal
   * @returns {boolean} True if cycle detected, false otherwise
   */
  hasCycle() {
    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;

      if (slow === fast) {
        return true;
      }
    }

    return false;
  }

  /**
   * Remove duplicates
   * Removes consecutive duplicate nodes (works best on sorted lists).
   * Compares each node with the next one and removes if they're equal.
   * Note: For unsorted lists, consider sorting first.
   * Time Complexity: O(n) - Linear, single traversal
   */
  removeDuplicates() {
    let current = this.head;

    while (current && current.next) {
      if (current.data === current.next.data) {
        current.next = current.next.next;
        if (current.next === null) {
          this.tail = current;
        }
      } else {
        current = current.next;
      }
    }
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== LINKED LIST OPERATIONS =====\n");

// Create a new linked list
const list = new LinkedList();

// Insert elements
console.log("1. Inserting elements at the end (10, 20, 30, 40, 50):");
list.insertAtEnd(10);
list.insertAtEnd(20);
list.insertAtEnd(30);
list.insertAtEnd(40);
list.insertAtEnd(50);
list.display();

// Insert at beginning
console.log("\n2. Insert 5 at the beginning:");
list.insertAtBeginning(5);
list.display();

// Insert at specific position
console.log("\n3. Insert 25 at position 3:");
list.insertAtPosition(25, 3);
list.display();

// Size of list
console.log("\n4. Size of list:", list.size());

// Search for element
console.log("\n5. Search for 25:", list.search(25));
console.log("   Search for 100:", list.search(100));

// Get element at position
console.log("\n6. Element at position 2:", list.getElementAt(2));

// Get first and last
console.log("\n7. First element:", list.getFirst());
console.log("   Last element:", list.getLast());

// Get middle element
console.log("\n8. Middle element:", list.getMiddle());

// Convert to array
console.log("\n9. List as array:", list.toArray());

// Delete from beginning
console.log("\n10. Delete from beginning:");
list.deleteFromBeginning();
list.display();

// Delete from end
console.log("\n11. Delete from end:");
list.deleteFromEnd();
list.display();

// Delete from position
console.log("\n12. Delete from position 2:");
list.deleteFromPosition(2);
list.display();

// Delete by value
console.log("\n13. Delete element with value 20:");
list.deleteByValue(20);
list.display();

// Reverse the list
console.log("\n14. Reverse the list:");
list.reverse();
list.display();

// Check if empty
console.log("\n15. Is list empty?", list.isEmpty());

// Clear the list
console.log("\n16. Clear the list:");
list.clear();
console.log("    List after clearing:");
list.display();
console.log("    Is list empty?", list.isEmpty());

// Demonstrate cycle detection
console.log("\n17. Testing cycle detection:");
const listWithCycle = new LinkedList();
listWithCycle.insertAtEnd(1);
listWithCycle.insertAtEnd(2);
listWithCycle.insertAtEnd(3);
console.log("    List without cycle - Has cycle?", listWithCycle.hasCycle());

// Demonstrate remove duplicates
console.log("\n18. Testing remove duplicates:");
const listWithDuplicates = new LinkedList();
listWithDuplicates.insertAtEnd(1);
listWithDuplicates.insertAtEnd(2);
listWithDuplicates.insertAtEnd(2);
listWithDuplicates.insertAtEnd(3);
listWithDuplicates.insertAtEnd(3);
listWithDuplicates.insertAtEnd(3);
console.log("    Before removing duplicates:");
listWithDuplicates.display();
listWithDuplicates.removeDuplicates();
console.log("    After removing duplicates:");
listWithDuplicates.display();
