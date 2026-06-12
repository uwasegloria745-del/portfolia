/**
 * Priority Queue Search Operations
 * Separate helper implementation for search-related methods on a priority queue.
 * This file includes a minimal priority queue implementation and search helpers
 * that allow finding values and priorities without removing elements.
 */

/**
 * PriorityQueue Class
 * Implements a min-heap priority queue with search support.
 */
class PriorityQueue {
  /**
   * Constructor for PriorityQueue
   * Initializes an empty heap array.
   */
  constructor() {
    this.heap = [];
  }

  /**
   * Check if the queue is empty
   * @returns {boolean} True if the priority queue has no elements
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Enqueue an element with a priority
   * Adds a value to the heap and restores the min-heap property.
   * @param {*} value - The element to insert
   * @param {number} priority - The priority for this element; lower numbers are dequeued first
   */
  enqueue(value, priority) {
    const node = { value, priority };
    this.heap.push(node);
    this._bubbleUp(this.heap.length - 1);
  }

  /**
   * Dequeue the element with highest priority
   * Removes and returns the element with the smallest priority value.
   * @returns {Object|null} The removed node or null when empty
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    this._swap(0, this.heap.length - 1);
    const min = this.heap.pop();
    this._bubbleDown(0);
    return min;
  }

  /**
   * Peek at the top element without dequeuing
   * @returns {Object|null} The top node or null if queue is empty
   */
  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  /**
   * Get the number of elements stored in the queue
   * @returns {number} Current queue size
   */
  getSize() {
    return this.heap.length;
  }

  /**
   * Search for a value in the priority queue
   * Performs a linear scan through the heap.
   * @param {*} value - The value to search for
   * @returns {boolean} True if the value exists, false otherwise
   */
  contains(value) {
    return this.heap.some(node => node.value === value);
  }

  /**
   * Find the priority of a stored value
   * Returns the priority for the first matching value.
   * @param {*} value - The value to look up
   * @returns {number|null} Priority value or null if not found
   */
  findPriority(value) {
    const node = this.heap.find(node => node.value === value);
    return node ? node.priority : null;
  }

  /**
   * Find all values that share a specific priority
   * @param {number} priority - The priority to search for
   * @returns {Array} An array of values with the matching priority
   */
  findAllByPriority(priority) {
    return this.heap.filter(node => node.priority === priority).map(node => node.value);
  }

  /**
   * Display the heap contents in array order
   */
  display() {
    console.log(this.heap.map(node => `${node.value}(${node.priority})`).join(' -> '));
  }

  /**
   * Restore heap order after insertion
   * Moves the node at index upward until the parent has smaller priority.
   * @param {number} index - Array index of the inserted node
   * @private
   */
  _bubbleUp(index) {
    let currentIndex = index;
    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);
      if (this.heap[currentIndex].priority >= this.heap[parentIndex].priority) {
        break;
      }
      this._swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  /**
   * Restore heap order after removal
   * Moves the node at index downward until both children have larger priorities.
   * @param {number} index - Array index of the node to bubble down
   * @private
   */
  _bubbleDown(index) {
    let currentIndex = index;
    const length = this.heap.length;

    while (true) {
      const left = 2 * currentIndex + 1;
      const right = 2 * currentIndex + 2;
      let smallest = currentIndex;

      if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === currentIndex) {
        break;
      }
      this._swap(currentIndex, smallest);
      currentIndex = smallest;
    }
  }

  /**
   * Swap two elements in the heap array
   * @param {number} i - First index
   * @param {number} j - Second index
   * @private
   */
  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

// ============== SEARCH OPERATIONS EXAMPLE ==============

console.log("===== PRIORITY QUEUE SEARCH OPERATIONS =====\n");
const searchPq = new PriorityQueue();
searchPq.enqueue('Task A', 4);
searchPq.enqueue('Task B', 2);
searchPq.enqueue('Task C', 5);
searchPq.enqueue('Task D', 1);
searchPq.enqueue('Task E', 3);

console.log("Queue contents:");
searchPq.display();

console.log("\nSearch for Task C:", searchPq.contains('Task C'));
console.log("Search for Task Z:", searchPq.contains('Task Z'));
console.log("\nPriority for Task B:", searchPq.findPriority('Task B'));
console.log("Priority for Task Z:", searchPq.findPriority('Task Z'));
console.log("\nItems with priority 3:", searchPq.findAllByPriority(3));
console.log("Items with priority 10:", searchPq.findAllByPriority(10));

console.log("\nTop priority item:", searchPq.peek());
console.log("Queue size:", searchPq.getSize());

console.log("\n===== END OF SEARCH OPERATIONS =====");