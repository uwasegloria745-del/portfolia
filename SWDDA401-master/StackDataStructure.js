/**
 * Stack Data Structure Implementation
 * A Stack is a linear data structure that follows LIFO (Last In First Out) principle
 * Elements are added and removed from the top (same end) of the stack
 */

/**
 * Node Class
 * Represents a single node/element in the stack.
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
 * Stack Class (Linked List Implementation)
 * Manages a sequence of nodes following LIFO principle.
 * Maintains reference to the top (head) for efficient operations.
 */
class Stack {
  /**
   * Constructor for Stack
   * Initializes an empty stack with no nodes
   */
  constructor() {
    this.top = null;     // Points to the top node in the stack
    this.size = 0;       // Tracks the number of elements
  }

  /**
   * Push (Add to top)
   * Adds a new element to the top of the stack.
   * Time Complexity: O(1) - Constant time
   * @param {*} data - The data to be added to the stack
   */
  push(data) {
    const newNode = new Node(data);

    if (this.top === null) {
      this.top = newNode;
    } else {
      newNode.next = this.top;
      this.top = newNode;
    }

    this.size++;
  }

  /**
   * Pop (Remove from top)
   * Removes and returns the element from the top of the stack.
   * Follows LIFO principle - last element added is first to be removed.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The data of the removed element, or null if stack is empty
   */
  pop() {
    if (this.top === null) {
      console.log("Stack underflow");
      return null;
    }

    const poppedData = this.top.data;
    this.top = this.top.next;
    this.size--;

    return poppedData;
  }

  /**
   * Peek at top
   * Returns the element at the top without removing it.
   * Useful to see what will be popped next.
   * Time Complexity: O(1) - Constant time
   * @returns {*} The data at the top, or null if stack is empty
   */
  peek() {
    return this.top === null ? null : this.top.data;
  }

  /**
   * Check if the stack is empty
   * Determines whether the stack contains any elements.
   * Time Complexity: O(1) - Constant time
   * @returns {boolean} True if stack is empty, false otherwise
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Get the size of the stack
   * Returns the total number of elements in the stack.
   * Time Complexity: O(1) - Constant time (size is tracked)
   * @returns {number} The number of elements in the stack
   */
  getSize() {
    return this.size;
  }

  /**
   * Clear the entire stack
   * Removes all elements by resetting top to null.
   * The garbage collector will clean up the removed nodes.
   * Time Complexity: O(1) - Constant time
   */
  clear() {
    this.top = null;
    this.size = 0;
  }

  /**
   * Search for an element
   * Checks if a value exists in the stack.
   * Returns true as soon as the element is found.
   * Time Complexity: O(n) - Linear, worst case searches entire stack
   * @param {*} data - The value to search for
   * @returns {boolean} True if element found, false otherwise
   */
  search(data) {
    let current = this.top;

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
   * Returns the data at the specified index (0-based from top).
   * Position 0 is the top of the stack.
   * Time Complexity: O(n) - Linear, traverses to the position
   * @param {number} position - The index to access (0-based, 0 is top)
   * @returns {*} The data at the position, or null if out of bounds
   */
  getElementAt(position) {
    if (position < 0 || position >= this.size) {
      return null;
    }

    let current = this.top;
    let count = 0;

    while (current && count < position) {
      current = current.next;
      count++;
    }

    return current ? current.data : null;
  }

  /**
   * Display all elements
   * Prints the stack in a readable format: top [elem1 | elem2 | elem3] bottom
   * Shows the order of elements from top to bottom.
   * Time Complexity: O(n) - Linear, traverses entire stack
   */
  display() {
    if (this.top === null) {
      console.log("Stack: []");
      return;
    }

    let result = "Stack: [";
    let current = this.top;

    while (current) {
      result += current.data;
      if (current.next) result += " | ";
      current = current.next;
    }

    result += "]";
    console.log(result);
  }

  /**
   * Display with indicators
   * Shows the stack with clear top indicator.
   * Helpful for visualizing LIFO operations.
   * Time Complexity: O(n) - Linear, traverses entire stack
   */
  displayWithIndicators() {
    if (this.top === null) {
      console.log("Stack: Empty");
      return;
    }

    let result = "Top -> ";
    let current = this.top;

    while (current) {
      result += current.data;
      if (current.next) result += " | ";
      current = current.next;
    }

    console.log(result);
  }

  /**
   * Convert to array
   * Creates and returns a JavaScript array containing all stack elements.
   * Maintains the order from top to bottom.
   * Time Complexity: O(n) - Linear, traverses entire stack
   * @returns {Array} Array containing all elements from top to bottom
   */
  toArray() {
    const arr = [];
    let current = this.top;

    while (current) {
      arr.push(current.data);
      current = current.next;
    }

    return arr;
  }

  /**
   * Count occurrences of a value
   * Returns how many times a value appears in the stack.
   * Time Complexity: O(n) - Searches through all elements
   * @param {*} data - The value to count
   * @returns {number} Number of occurrences
   */
  countOccurrences(data) {
    let count = 0;
    let current = this.top;

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
   * Deletes all instances of the specified value from the stack.
   * Time Complexity: O(n) - Traverses entire stack
   * @param {*} data - The value to remove
   * @returns {number} Number of elements removed
   */
  removeAllOccurrences(data) {
    let count = 0;
    let current = this.top;
    let previous = null;

    while (current) {
      if (current.data === data) {
        if (previous === null) {
          this.top = current.next;
        } else {
          previous.next = current.next;
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
   * Duplicate stack
   * Creates and returns a copy of the current stack.
   * The new stack is independent of the original.
   * Time Complexity: O(n) - Must traverse and copy all elements
   * @returns {Stack} A new stack with the same elements in same order
   */
  duplicate() {
    const newStack = new Stack();
    const tempArray = [];
    let current = this.top;

    // Collect elements
    while (current) {
      tempArray.push(current.data);
      current = current.next;
    }

    // Add to new stack in reverse to maintain order
    for (let i = tempArray.length - 1; i >= 0; i--) {
      newStack.push(tempArray[i]);
    }

    return newStack;
  }

  /**
   * Check if value exists (contains)
   * Determines if a specific value is in the stack.
   * Time Complexity: O(n) - Linear search
   * @param {*} data - The value to check
   * @returns {boolean} True if value exists, false otherwise
   */
  contains(data) {
    return this.search(data);
  }

  /**
   * Print stack status
   * Displays detailed information about the stack.
   * Time Complexity: O(n) - Traverses entire stack
   */
  printStatus() {
    console.log("=== Stack Status ===");
    console.log("Size:", this.size);
    console.log("Is Empty:", this.isEmpty());
    console.log("Top Element:", this.peek());
    console.log("Elements:", this.toArray());
  }

  /**
   * Check if stack is balanced (for parentheses/brackets)
   * Checks if parentheses, brackets, and braces are properly balanced.
   * Useful for syntax validation.
   * Time Complexity: O(n) - Single pass through string
   * @param {string} str - The string to check for balance
   * @returns {boolean} True if brackets are balanced, false otherwise
   */
  static isBalanced(str) {
    const stack = new Stack();
    const pairs = { '(': ')', '[': ']', '{': '}' };

    for (let char of str) {
      if (char in pairs) {
        // Opening bracket
        stack.push(char);
      } else if (Object.values(pairs).includes(char)) {
        // Closing bracket
        if (stack.isEmpty() || pairs[stack.pop()] !== char) {
          return false;
        }
      }
    }

    return stack.isEmpty();
  }

  /**
   * Reverse a string using stack
   * Uses stack to reverse the order of characters in a string.
   * Time Complexity: O(n) - Linear
   * @param {string} str - The string to reverse
   * @returns {string} The reversed string
   */
  static reverseString(str) {
    const stack = new Stack();

    for (let char of str) {
      stack.push(char);
    }

    let result = "";
    while (!stack.isEmpty()) {
      result += stack.pop();
    }

    return result;
  }

  /**
   * Convert decimal to binary using stack
   * Uses stack to store remainders during binary conversion.
   * Time Complexity: O(log n) - Number of bits
   * @param {number} num - The decimal number to convert
   * @returns {string} The binary representation
   */
  static decimalToBinary(num) {
    const stack = new Stack();
    let n = num;

    if (n === 0) return "0";

    while (n > 0) {
      stack.push(n % 2);
      n = Math.floor(n / 2);
    }

    let binary = "";
    while (!stack.isEmpty()) {
      binary += stack.pop();
    }

    return binary;
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== STACK DATA STRUCTURE =====\n");

// Create a new stack
const stack = new Stack();

// Push elements
console.log("1. Pushing elements (10, 20, 30, 40, 50):");
stack.push(10);
stack.push(20);
stack.push(30);
stack.push(40);
stack.push(50);
stack.displayWithIndicators();
console.log("   Size:", stack.getSize());

// Peek operation
console.log("\n2. Peek operation:");
console.log("   Top element:", stack.peek());

// Pop elements
console.log("\n3. Pop elements (LIFO - Last In First Out):");
console.log("   Popped:", stack.pop());
stack.displayWithIndicators();
console.log("   Popped:", stack.pop());
stack.displayWithIndicators();

// Search
console.log("\n4. Search operations:");
console.log("   Search for 30:", stack.search(30));
console.log("   Search for 100:", stack.search(100));
console.log("   Contains 40?", stack.contains(40));

// Get element at position
console.log("\n5. Get element at position:");
console.log("   Element at position 0 (top):", stack.getElementAt(0));
console.log("   Element at position 1:", stack.getElementAt(1));
console.log("   Element at position 5:", stack.getElementAt(5));

// Size and empty check
console.log("\n6. Stack properties:");
console.log("   Size:", stack.getSize());
console.log("   Is empty?", stack.isEmpty());

// Convert to array
console.log("\n7. Convert to array:");
console.log("   Array representation:", stack.toArray());

// Count occurrences
console.log("\n8. Count occurrences:");
const stack2 = new Stack();
[10, 20, 20, 30, 30, 30, 40].forEach(val => stack2.push(val));
console.log("   Stack:", stack2.toArray());
console.log("   Occurrences of 20:", stack2.countOccurrences(20));
console.log("   Occurrences of 30:", stack2.countOccurrences(30));

// Remove all occurrences
console.log("\n9. Remove all occurrences:");
const stack3 = new Stack();
[10, 20, 20, 30, 30, 30, 40, 40].forEach(val => stack3.push(val));
console.log("   Before removing 30's:");
stack3.displayWithIndicators();
const removed = stack3.removeAllOccurrences(30);
console.log("   After removing 30's (removed:", removed, "):");
stack3.displayWithIndicators();

// Duplicate stack
console.log("\n10. Duplicate stack:");
const originalStack = new Stack();
[10, 20, 30, 40, 50].forEach(val => originalStack.push(val));
console.log("    Original stack:");
originalStack.displayWithIndicators();
const duplicatedStack = originalStack.duplicate();
console.log("    Duplicated stack:");
duplicatedStack.displayWithIndicators();

// Stack status
console.log("\n11. Stack status:");
const statusStack = new Stack();
[5, 15, 25, 35].forEach(val => statusStack.push(val));
statusStack.printStatus();

// Clear stack
console.log("\n12. Clear the stack:");
const clearStack = new Stack();
[1, 2, 3, 4, 5].forEach(val => clearStack.push(val));
console.log("    Before clearing:");
clearStack.displayWithIndicators();
clearStack.clear();
console.log("    After clearing:");
clearStack.displayWithIndicators();
console.log("    Is empty?", clearStack.isEmpty());

// Balanced parentheses check
console.log("\n13. Balanced brackets validation:");
console.log("    '(())': ", Stack.isBalanced("(())"));
console.log("    '([{}])': ", Stack.isBalanced("([{}])"));
console.log("    '(([)]': ", Stack.isBalanced("(([)]"));
console.log("    '((()))': ", Stack.isBalanced("((()))"));
console.log("    '([)]': ", Stack.isBalanced("([)]"));

// Reverse string using stack
console.log("\n14. Reverse string using stack:");
const str1 = "HELLO";
const str2 = "JavaScript";
console.log("    Original: '", str1, "' -> Reversed: '", Stack.reverseString(str1), "'");
console.log("    Original: '", str2, "' -> Reversed: '", Stack.reverseString(str2), "'");

// Decimal to binary conversion
console.log("\n15. Decimal to binary conversion:");
const numbers = [10, 15, 20, 25, 32];
numbers.forEach(num => {
  console.log("    Decimal:", num, "-> Binary:", Stack.decimalToBinary(num));
});

// Real-world example: Browser history (back button)
console.log("\n16. Real-world example - Browser History:");
const history = new Stack();
const visited = [];

function visitPage(page) {
  history.push(page);
  visited.push(page);
  console.log("    Visited:", page);
}

function goBack() {
  const page = history.pop();
  if (page) {
    console.log("    Went back to:", page);
  } else {
    console.log("    No history available");
  }
}

visitPage("google.com");
visitPage("github.com");
visitPage("stackoverflow.com");
console.log("    Current history:", history.toArray());

goBack();
goBack();
console.log("    After two back clicks:", history.toArray());

// Real-world example: Function call stack (recursion)
console.log("\n17. Function call stack simulation:");
const callStack = new Stack();

function simulate_functionCall(name) {
  callStack.push(name);
  console.log("    Called:", name, "| Stack:", callStack.toArray());
}

function simulate_functionReturn() {
  const func = callStack.pop();
  console.log("    Returned from:", func, "| Stack:", callStack.toArray());
}

simulate_functionCall("main()");
simulate_functionCall("function_A()");
simulate_functionCall("function_B()");
simulate_functionReturn();
simulate_functionReturn();
simulate_functionReturn();

console.log("\n===== END OF STACK EXAMPLES =====");
