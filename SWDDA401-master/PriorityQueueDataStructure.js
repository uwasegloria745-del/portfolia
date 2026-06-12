/**
 * Priority Queue Data Structure Implementation
 * A Priority Queue stores elements with priorities and always dequeues the element with highest priority first.
 * This implementation uses a min-heap for the priority queue.
 */

/**
 * PriorityQueue Class
 * Implements enqueue, dequeue, peek, and utility operations.
 */
class PriorityQueue {
  /**
   * Constructor for PriorityQueue
   */
  constructor() {
    this.heap = [];
  }

  /**
   * Check if queue is empty
   * Time Complexity: O(1)
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Insert an element with priority
   * Time Complexity: O(log n)
   * @param {*} value - The value to insert
   * @param {number} priority - The priority of the element
   */
  enqueue(value, priority) {
    const node = { value, priority };
    this.heap.push(node);
    this._bubbleUp(this.heap.length - 1);
  }

  /**
   * Remove and return the element with highest priority (lowest priority number)
   * Time Complexity: O(log n)
   * @returns {Object|null} The dequeued node or null if empty
   */
  dequeue() {
    if (this.isEmpty()) {
      console.log("PriorityQueue is empty");
      return null;
    }

    this._swap(0, this.heap.length - 1);
    const min = this.heap.pop();
    this._bubbleDown(0);
    return min;
  }

  /**
   * Peek at the element with highest priority without removing it
   * Time Complexity: O(1)
   * @returns {Object|null} The top node or null if empty
   */
  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  /**
   * Get the size of the queue
   * Time Complexity: O(1)
   * @returns {number} Number of elements in the queue
   */
  getSize() {
    return this.heap.length;
  }

  /**
   * Search for a value in the priority queue
   * Linear scan through heap elements to find matching value.
   * Time Complexity: O(n)
   * @param {*} value - The value to search for
   * @returns {boolean} True if value exists, false otherwise
   */
  contains(value) {
    return this.heap.some(node => node.value === value);
  }

  /**
   * Find the priority of a value in the queue
   * Returns the priority of the first matching value.
   * Time Complexity: O(n)
   * @param {*} value - The value to search for
   * @returns {number|null} Priority if found, otherwise null
   */
  findPriority(value) {
    const node = this.heap.find(node => node.value === value);
    return node ? node.priority : null;
  }

  /**
   * Find all items with a given priority
   * Time Complexity: O(n)
   * @param {number} priority - The priority to search for
   * @returns {Array} Array of values with matching priority
   */
  findAllByPriority(priority) {
    return this.heap
      .filter(node => node.priority === priority)
      .map(node => node.value);
  }

  /**
   * Print heap contents
   * Time Complexity: O(n)
   */
  display() {
    console.log(this.heap.map(node => `${node.value}(${node.priority})`).join(' -> '));
  }

  /**
   * Bubble up an element to restore heap property
   * @param {number} index - Index to bubble up
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
   * Bubble down an element to restore heap property
   * @param {number} index - Index to bubble down
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
   * Swap two heap elements
   * @param {number} i
   * @param {number} j
   * @private
   */
  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== PRIORITY QUEUE DATA STRUCTURE =====\n");
const pq = new PriorityQueue();

console.log("1. Enqueue elements with priorities:");
pq.enqueue('Task A', 4);
pq.enqueue('Task B', 2);
pq.enqueue('Task C', 5);
pq.enqueue('Task D', 1);
pq.enqueue('Task E', 3);
pq.display();

console.log("\n2. Search operations:");
console.log("   Contains 'Task C'?", pq.contains('Task C'));
console.log("   Priority of 'Task B':", pq.findPriority('Task B'));
console.log("   Items with priority 3:", pq.findAllByPriority(3));

console.log("\n3. Peek top priority element:", pq.peek());

console.log("\n4. Dequeue elements in priority order:");
while (!pq.isEmpty()) {
  console.log(pq.dequeue());
}

console.log("\n4. Reuse queue after emptying:");
pq.enqueue('Low priority', 10);
pq.enqueue('High priority', 1);
pq.enqueue('Medium priority', 5);
pq.display();
console.log("   Dequeued:", pq.dequeue());
pq.display();

console.log("\n===== END OF PRIORITY QUEUE EXAMPLES =====");