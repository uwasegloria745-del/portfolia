/**
 * Array Data Structure Implementation
 * A custom array implementation with all fundamental operations and algorithms
 * Provides both basic array operations and advanced algorithms
 */

/**
 * DynamicArray Class
 * Implements a dynamic array that grows as needed.
 * Unlike JavaScript's built-in array, this shows how arrays work at a lower level.
 */
class DynamicArray {
  /**
   * Constructor for DynamicArray
   * Initializes an empty array with initial capacity
   * @param {number} capacity - Initial capacity of the array (default: 10)
   */
  constructor(capacity = 10) {
    this.data = new Array(capacity);      // The actual storage
    this.capacity = capacity;              // Total space available
    this.size = 0;                         // Current number of elements
  }

  /**
   * Get element at a specific index
   * Accesses the element at the given position.
   * Time Complexity: O(1) - Direct access via index
   * @param {number} index - The index to access (0-based)
   * @returns {*} The element at the index, or undefined if out of bounds
   */
  get(index) {
    if (index < 0 || index >= this.size) {
      console.log("Index out of bounds");
      return undefined;
    }
    return this.data[index];
  }

  /**
   * Set element at a specific index
   * Updates the element at the given position.
   * Time Complexity: O(1) - Direct assignment via index
   * @param {number} index - The index to update (0-based)
   * @param {*} value - The new value to set
   */
  set(index, value) {
    if (index < 0 || index >= this.size) {
      console.log("Index out of bounds");
      return;
    }
    this.data[index] = value;
  }

  /**
   * Insert element at the beginning
   * Adds a new element at the start and shifts all other elements right.
   * Time Complexity: O(n) - Must shift all elements
   * @param {*} value - The value to insert
   */
  insertAtBeginning(value) {
    this.ensureCapacity();
    
    // Shift all elements to the right
    for (let i = this.size; i > 0; i--) {
      this.data[i] = this.data[i - 1];
    }
    
    this.data[0] = value;
    this.size++;
  }

  /**
   * Insert element at the end
   * Appends a new element at the end of the array.
   * Time Complexity: O(1) amortized - Usually constant, but O(n) when resizing
   * @param {*} value - The value to insert
   */
  insertAtEnd(value) {
    this.ensureCapacity();
    this.data[this.size] = value;
    this.size++;
  }

  /**
   * Insert element at a specific position
   * Adds a new element at the specified index and shifts elements right.
   * Time Complexity: O(n) - Must shift elements after the insertion point
   * @param {number} index - The index where to insert (0-based)
   * @param {*} value - The value to insert
   */
  insertAtPosition(index, value) {
    if (index < 0 || index > this.size) {
      console.log("Invalid index");
      return;
    }

    this.ensureCapacity();

    // Shift elements to the right
    for (let i = this.size; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }

    this.data[index] = value;
    this.size++;
  }

  /**
   * Delete element from the beginning
   * Removes the first element and shifts all elements left.
   * Time Complexity: O(n) - Must shift all remaining elements
   * @returns {*} The deleted element, or undefined if array is empty
   */
  deleteFromBeginning() {
    if (this.size === 0) {
      console.log("Array is empty");
      return undefined;
    }

    const deletedValue = this.data[0];

    // Shift all elements to the left
    for (let i = 0; i < this.size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }

    this.size--;
    return deletedValue;
  }

  /**
   * Delete element from the end
   * Removes the last element from the array.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The deleted element, or undefined if array is empty
   */
  deleteFromEnd() {
    if (this.size === 0) {
      console.log("Array is empty");
      return undefined;
    }

    const deletedValue = this.data[this.size - 1];
    this.size--;
    return deletedValue;
  }

  /**
   * Delete element from a specific position
   * Removes the element at the specified index and shifts elements left.
   * Time Complexity: O(n) - Must shift elements after the deletion point
   * @param {number} index - The index to delete (0-based)
   * @returns {*} The deleted element, or undefined if index is invalid
   */
  deleteFromPosition(index) {
    if (index < 0 || index >= this.size) {
      console.log("Index out of bounds");
      return undefined;
    }

    const deletedValue = this.data[index];

    // Shift elements to the left
    for (let i = index; i < this.size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }

    this.size--;
    return deletedValue;
  }

  /**
   * Delete by value
   * Removes the first occurrence of the specified value.
   * Time Complexity: O(n) - Searches through array, then shifts elements
   * @param {*} value - The value to delete
   * @returns {boolean} True if element was deleted, false if not found
   */
  deleteByValue(value) {
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] === value) {
        this.deleteFromPosition(i);
        return true;
      }
    }
    return false;
  }

  /**
   * Linear search for an element
   * Searches through the array from start to end to find a value.
   * Time Complexity: O(n) - Linear search through elements
   * @param {*} value - The value to search for
   * @returns {number} The index of the element, or -1 if not found
   */
  linearSearch(value) {
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] === value) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Binary search for an element (array must be sorted)
   * Uses divide-and-conquer approach to efficiently search a sorted array.
   * Time Complexity: O(log n) - Much faster than linear search
   * @param {*} value - The value to search for
   * @returns {number} The index of the element, or -1 if not found
   */
  binarySearch(value) {
    let left = 0;
    let right = this.size - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.data[mid] === value) {
        return mid;
      } else if (this.data[mid] < value) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }

  /**
   * Get the size of the array
   * Returns the number of elements currently stored.
   * Time Complexity: O(1) - Constant time
   * @returns {number} The number of elements in the array
   */
  getSize() {
    return this.size;
  }

  /**
   * Get the capacity of the array
   * Returns the total space available (including unused space).
   * Time Complexity: O(1) - Constant time
   * @returns {number} The total capacity
   */
  getCapacity() {
    return this.capacity;
  }

  /**
   * Check if the array is empty
   * Determines whether the array contains any elements.
   * Time Complexity: O(1) - Constant time
   * @returns {boolean} True if array is empty, false otherwise
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Check if the array is full
   * Determines whether the array needs to be resized.
   * Time Complexity: O(1) - Constant time
   * @returns {boolean} True if size equals capacity, false otherwise
   */
  isFull() {
    return this.size === this.capacity;
  }

  /**
   * Ensure sufficient capacity
   * Automatically doubles the capacity when the array is full.
   * This is how dynamic arrays grow.
   * Time Complexity: O(n) - When resizing, must copy all elements
   */
  ensureCapacity() {
    if (this.isFull()) {
      const newCapacity = this.capacity * 2;
      const newData = new Array(newCapacity);

      // Copy old data to new array
      for (let i = 0; i < this.size; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
      this.capacity = newCapacity;
    }
  }

  /**
   * Clear the entire array
   * Removes all elements and resets the size.
   * Time Complexity: O(1) - Just reset the size
   */
  clear() {
    this.size = 0;
  }

  /**
   * Display all elements
   * Prints the array in a readable format: [elem1, elem2, elem3, ...]
   * Time Complexity: O(n) - Must traverse and print each element
   */
  display() {
    let result = "[";
    for (let i = 0; i < this.size; i++) {
      result += this.data[i];
      if (i < this.size - 1) result += ", ";
    }
    result += "]";
    console.log(result);
  }

  /**
   * Convert to JavaScript array
   * Creates a standard JavaScript array containing all elements.
   * Time Complexity: O(n) - Must copy all elements
   * @returns {Array} JavaScript array with all elements
   */
  toArray() {
    const arr = [];
    for (let i = 0; i < this.size; i++) {
      arr.push(this.data[i]);
    }
    return arr;
  }

  /**
   * Reverse the array
   * Reverses the order of all elements in the array.
   * Time Complexity: O(n) - Swap each element once
   */
  reverse() {
    for (let i = 0; i < Math.floor(this.size / 2); i++) {
      const temp = this.data[i];
      this.data[i] = this.data[this.size - 1 - i];
      this.data[this.size - 1 - i] = temp;
    }
  }

  /**
   * Rotate array to the right
   * Shifts all elements to the right by k positions.
   * Elements at the end wrap around to the beginning.
   * Time Complexity: O(n) - Single pass through array
   * @param {number} k - Number of positions to rotate
   */
  rotateRight(k) {
    if (this.size === 0) return;

    k = k % this.size; // Handle k larger than size
    this.reverse();
    this.reverseRange(0, k - 1);
    this.reverseRange(k, this.size - 1);
  }

  /**
   * Rotate array to the left
   * Shifts all elements to the left by k positions.
   * Elements at the beginning wrap around to the end.
   * Time Complexity: O(n) - Single pass through array
   * @param {number} k - Number of positions to rotate
   */
  rotateLeft(k) {
    if (this.size === 0) return;

    k = k % this.size;
    this.reverseRange(0, k - 1);
    this.reverseRange(k, this.size - 1);
    this.reverse();
  }

  /**
   * Helper method: Reverse a range of elements
   * Reverses elements from startIndex to endIndex (inclusive).
   * Time Complexity: O(k) - Where k is the range size
   * @param {number} startIndex - Start of range to reverse
   * @param {number} endIndex - End of range to reverse
   */
  reverseRange(startIndex, endIndex) {
    while (startIndex < endIndex) {
      const temp = this.data[startIndex];
      this.data[startIndex] = this.data[endIndex];
      this.data[endIndex] = temp;
      startIndex++;
      endIndex--;
    }
  }

  /**
   * Shuffle the array (Fisher-Yates algorithm)
   * Randomly randomizes the order of elements.
   * Time Complexity: O(n) - Single pass with random operations
   */
  shuffle() {
    for (let i = this.size - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = this.data[i];
      this.data[i] = this.data[j];
      this.data[j] = temp;
    }
  }

  /**
   * Bubble Sort algorithm
   * Compares adjacent elements and swaps if they're in wrong order.
   * Time Complexity: O(n²) - Nested loops, not efficient for large arrays
   * Space Complexity: O(1) - In-place sorting
   */
  bubbleSort() {
    for (let i = 0; i < this.size - 1; i++) {
      for (let j = 0; j < this.size - i - 1; j++) {
        if (this.data[j] > this.data[j + 1]) {
          const temp = this.data[j];
          this.data[j] = this.data[j + 1];
          this.data[j + 1] = temp;
        }
      }
    }
  }

  /**
   * Selection Sort algorithm
   * Finds minimum element and places it at the beginning.
   * Time Complexity: O(n²) - Nested loops
   * Space Complexity: O(1) - In-place sorting
   */
  selectionSort() {
    for (let i = 0; i < this.size - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < this.size; j++) {
        if (this.data[j] < this.data[minIndex]) {
          minIndex = j;
        }
      }

      // Swap minimum element to current position
      const temp = this.data[i];
      this.data[i] = this.data[minIndex];
      this.data[minIndex] = temp;
    }
  }

  /**
   * Insertion Sort algorithm
   * Builds sorted array one item at a time by inserting into correct position.
   * Time Complexity: O(n²) worst case, O(n) best case (already sorted)
   * Space Complexity: O(1) - In-place sorting
   */
  insertionSort() {
    for (let i = 1; i < this.size; i++) {
      const key = this.data[i];
      let j = i - 1;

      while (j >= 0 && this.data[j] > key) {
        this.data[j + 1] = this.data[j];
        j--;
      }

      this.data[j + 1] = key;
    }
  }

  /**
   * Merge Sort algorithm
   * Divide-and-conquer algorithm: divide array, sort halves, merge them.
   * Time Complexity: O(n log n) - Much faster for large arrays
   * Space Complexity: O(n) - Requires extra space for merging
   */
  mergeSort() {
    this.mergeSortHelper(0, this.size - 1);
  }

  /**
   * Helper method for Merge Sort
   * Recursively divides and sorts the array.
   * @param {number} left - Left boundary index
   * @param {number} right - Right boundary index
   */
  mergeSortHelper(left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      this.mergeSortHelper(left, mid);
      this.mergeSortHelper(mid + 1, right);
      this.merge(left, mid, right);
    }
  }

  /**
   * Helper method: Merge two sorted subarrays
   * Combines two sorted portions into one sorted portion.
   * @param {number} left - Left boundary index
   * @param {number} mid - Middle index
   * @param {number} right - Right boundary index
   */
  merge(left, mid, right) {
    const leftArray = [];
    const rightArray = [];

    // Copy data to temporary arrays
    for (let i = left; i <= mid; i++) {
      leftArray.push(this.data[i]);
    }
    for (let i = mid + 1; i <= right; i++) {
      rightArray.push(this.data[i]);
    }

    // Merge the arrays back
    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
      if (leftArray[i] <= rightArray[j]) {
        this.data[k++] = leftArray[i++];
      } else {
        this.data[k++] = rightArray[j++];
      }
    }

    // Copy remaining elements
    while (i < leftArray.length) {
      this.data[k++] = leftArray[i++];
    }
    while (j < rightArray.length) {
      this.data[k++] = rightArray[j++];
    }
  }

  /**
   * Quick Sort algorithm
   * Divide-and-conquer using pivot partitioning.
   * Time Complexity: O(n log n) average, O(n²) worst case
   * Space Complexity: O(log n) - For recursion stack
   */
  quickSort() {
    this.quickSortHelper(0, this.size - 1);
  }

  /**
   * Helper method for Quick Sort
   * Recursively sorts using partition.
   * @param {number} low - Lower boundary index
   * @param {number} high - Upper boundary index
   */
  quickSortHelper(low, high) {
    if (low < high) {
      const pivotIndex = this.partition(low, high);
      this.quickSortHelper(low, pivotIndex - 1);
      this.quickSortHelper(pivotIndex + 1, high);
    }
  }

  /**
   * Helper method: Partition for Quick Sort
   * Rearranges elements around a pivot.
   * @param {number} low - Lower boundary index
   * @param {number} high - Upper boundary index
   * @returns {number} Index of pivot after partition
   */
  partition(low, high) {
    const pivot = this.data[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (this.data[j] < pivot) {
        i++;
        const temp = this.data[i];
        this.data[i] = this.data[j];
        this.data[j] = temp;
      }
    }

    const temp = this.data[i + 1];
    this.data[i + 1] = this.data[high];
    this.data[high] = temp;

    return i + 1;
  }

  /**
   * Find the maximum element
   * Returns the largest value in the array.
   * Time Complexity: O(n) - Must check all elements
   * @returns {*} The maximum element, or undefined if array is empty
   */
  findMax() {
    if (this.size === 0) return undefined;

    let max = this.data[0];
    for (let i = 1; i < this.size; i++) {
      if (this.data[i] > max) {
        max = this.data[i];
      }
    }
    return max;
  }

  /**
   * Find the minimum element
   * Returns the smallest value in the array.
   * Time Complexity: O(n) - Must check all elements
   * @returns {*} The minimum element, or undefined if array is empty
   */
  findMin() {
    if (this.size === 0) return undefined;

    let min = this.data[0];
    for (let i = 1; i < this.size; i++) {
      if (this.data[i] < min) {
        min = this.data[i];
      }
    }
    return min;
  }

  /**
   * Calculate the sum of all elements
   * Adds up all numeric values in the array.
   * Time Complexity: O(n) - Single traversal
   * @returns {number} The sum of all elements
   */
  sum() {
    let total = 0;
    for (let i = 0; i < this.size; i++) {
      total += this.data[i];
    }
    return total;
  }

  /**
   * Calculate the average of all elements
   * Returns the mean value of all elements.
   * Time Complexity: O(n) - Single traversal
   * @returns {number} The average of all elements
   */
  average() {
    if (this.size === 0) return 0;
    return this.sum() / this.size;
  }

  /**
   * Count occurrences of a value
   * Returns how many times a value appears in the array.
   * Time Complexity: O(n) - Searches through all elements
   * @param {*} value - The value to count
   * @returns {number} Number of occurrences
   */
  countOccurrences(value) {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] === value) {
        count++;
      }
    }
    return count;
  }

  /**
   * Remove all occurrences of a value
   * Deletes all instances of the specified value.
   * Time Complexity: O(n) - May need to shift multiple times
   * @param {*} value - The value to remove
   * @returns {number} Number of elements removed
   */
  removeAllOccurrences(value) {
    let count = 0;
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] === value) {
        this.deleteFromPosition(i);
        i--;
        count++;
      }
    }
    return count;
  }

  /**
   * Resize the array
   * Changes the array to a new size.
   * Time Complexity: O(n) - Must copy elements
   * @param {number} newCapacity - The new capacity to resize to
   */
  resize(newCapacity) {
    const newData = new Array(newCapacity);

    // Copy elements up to the minimum of old and new capacity
    const copySize = Math.min(this.size, newCapacity);
    for (let i = 0; i < copySize; i++) {
      newData[i] = this.data[i];
    }

    this.data = newData;
    this.capacity = newCapacity;
    this.size = Math.min(this.size, newCapacity);
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== DYNAMIC ARRAY DATA STRUCTURE =====\n");

// Create a new dynamic array
const arr = new DynamicArray();

// Insert elements
console.log("1. Inserting elements at the end (10, 20, 30, 40, 50, 60):");
arr.insertAtEnd(10);
arr.insertAtEnd(20);
arr.insertAtEnd(30);
arr.insertAtEnd(40);
arr.insertAtEnd(50);
arr.insertAtEnd(60);
arr.display();
console.log("   Size:", arr.getSize(), "Capacity:", arr.getCapacity());

// Insert at beginning
console.log("\n2. Insert 5 at the beginning:");
arr.insertAtBeginning(5);
arr.display();

// Insert at position
console.log("\n3. Insert 25 at position 3:");
arr.insertAtPosition(25, 3);
arr.display();

// Get element
console.log("\n4. Get element at position 2:", arr.get(2));

// Set element
console.log("\n5. Set element at position 2 to 99:");
arr.set(2, 99);
arr.display();

// Search operations
console.log("\n6. Linear search for 40:", arr.linearSearch(40));
console.log("   Linear search for 100:", arr.linearSearch(100));

// Size and capacity
console.log("\n7. Array size:", arr.getSize());
console.log("   Array capacity:", arr.getCapacity());

// Find max and min
console.log("\n8. Maximum element:", arr.findMax());
console.log("   Minimum element:", arr.findMin());

// Sum and average
console.log("\n9. Sum of all elements:", arr.sum());
console.log("   Average:", arr.average());

// Count occurrences
console.log("\n10. Count occurrences of 20:", arr.countOccurrences(20));

// Reverse
console.log("\n11. Reverse the array:");
arr.reverse();
arr.display();

// Binary search (array should be sorted for this)
const sortedArr = new DynamicArray();
console.log("\n12. Binary search (on sorted array):");
[10, 20, 30, 40, 50, 60, 70, 80, 90].forEach(val => sortedArr.insertAtEnd(val));
console.log("    Array:", sortedArr.toArray());
console.log("    Binary search for 50:", sortedArr.binarySearch(50));
console.log("    Binary search for 100:", sortedArr.binarySearch(100));

// Sorting algorithms
console.log("\n13. Sorting algorithms comparison:");
const bubbleArr = new DynamicArray();
const selectionArr = new DynamicArray();
const insertionArr = new DynamicArray();
const mergeArr = new DynamicArray();
const quickArr = new DynamicArray();
const testValues = [64, 34, 25, 12, 22, 11, 90, 88];

testValues.forEach(val => {
  bubbleArr.insertAtEnd(val);
  selectionArr.insertAtEnd(val);
  insertionArr.insertAtEnd(val);
  mergeArr.insertAtEnd(val);
  quickArr.insertAtEnd(val);
});

console.log("    Original: ", bubbleArr.toArray());

bubbleArr.bubbleSort();
console.log("    Bubble Sort: ", bubbleArr.toArray());

selectionArr.selectionSort();
console.log("    Selection Sort: ", selectionArr.toArray());

insertionArr.insertionSort();
console.log("    Insertion Sort: ", insertionArr.toArray());

mergeArr.mergeSort();
console.log("    Merge Sort: ", mergeArr.toArray());

quickArr.quickSort();
console.log("    Quick Sort: ", quickArr.toArray());

// Rotation
console.log("\n14. Array rotation:");
const rotateArr = new DynamicArray();
[1, 2, 3, 4, 5].forEach(val => rotateArr.insertAtEnd(val));
console.log("    Original: ", rotateArr.toArray());
rotateArr.rotateLeft(2);
console.log("    After rotating left by 2: ", rotateArr.toArray());

const rotateArr2 = new DynamicArray();
[1, 2, 3, 4, 5].forEach(val => rotateArr2.insertAtEnd(val));
rotateArr2.rotateRight(2);
console.log("    After rotating right by 2: ", rotateArr2.toArray());

// Shuffle
console.log("\n15. Array shuffle (Fisher-Yates):");
const shuffleArr = new DynamicArray();
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(val => shuffleArr.insertAtEnd(val));
console.log("    Before shuffle: ", shuffleArr.toArray());
shuffleArr.shuffle();
console.log("    After shuffle: ", shuffleArr.toArray());

// Delete operations
console.log("\n16. Delete operations:");
const delArr = new DynamicArray();
[10, 20, 30, 40, 50].forEach(val => delArr.insertAtEnd(val));
console.log("    Original: ", delArr.toArray());

delArr.deleteFromBeginning();
console.log("    After deleteFromBeginning: ", delArr.toArray());

delArr.deleteFromEnd();
console.log("    After deleteFromEnd: ", delArr.toArray());

delArr.deleteFromPosition(1);
console.log("    After deleteFromPosition(1): ", delArr.toArray());

// Remove duplicates
console.log("\n17. Remove duplicates:");
const dupArr = new DynamicArray();
[1, 2, 2, 3, 3, 3, 4, 4, 5].forEach(val => dupArr.insertAtEnd(val));
console.log("    Before: ", dupArr.toArray());
const removed = dupArr.removeAllOccurrences(3);
console.log("    After removing all 3's (removed:", removed, "): ", dupArr.toArray());

// Clear array
console.log("\n18. Clear array:");
const clearArr = new DynamicArray();
[1, 2, 3, 4, 5].forEach(val => clearArr.insertAtEnd(val));
console.log("    Before clear: ", clearArr.toArray());
clearArr.clear();
console.log("    After clear: ", clearArr.toArray());
console.log("    Is empty?", clearArr.isEmpty());
