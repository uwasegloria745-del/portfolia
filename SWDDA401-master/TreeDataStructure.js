/**
 * Binary Search Tree (BST) Data Structure Implementation
 * A Binary Search Tree is a hierarchical data structure where each node has at most two children.
 * Property: Left child < Parent < Right child
 * Enables efficient searching, insertion, and deletion operations
 */

/**
 * TreeNode Class
 * Represents a single node in the binary search tree.
 * Each node contains data and references to left and right children.
 */
class TreeNode {
  /**
   * Constructor for TreeNode
   * @param {*} data - The value/data to be stored in the node
   */
  constructor(data) {
    this.data = data;        // Stores the actual data/value
    this.left = null;        // Reference to left child node
    this.right = null;       // Reference to right child node
    this.height = 1;         // Height of the node (for balance checking)
  }
}

/**
 * BinarySearchTree Class
 * Implements a binary search tree with all fundamental operations.
 * Maintains a root reference to build the tree structure.
 */
class BinarySearchTree {
  /**
   * Constructor for BinarySearchTree
   * Initializes an empty binary search tree
   */
  constructor() {
    this.root = null;    // Points to the root node of the tree
    this.size = 0;       // Tracks the number of nodes
  }

  /**
   * Insert a value into the tree
   * Adds a new node following BST property: left < parent < right.
   * Recursively finds the correct position for the new value.
   * Time Complexity: O(log n) average, O(n) worst case (skewed tree)
   * @param {*} data - The value to insert
   */
  insert(data) {
    if (this.root === null) {
      this.root = new TreeNode(data);
      this.size = 1;
    } else {
      this._insertHelper(this.root, data);
    }
  }

  /**
   * Helper method for insert
   * Recursively traverses the tree to find insertion position.
   * @param {TreeNode} node - Current node being examined
   * @param {*} data - The value to insert
   * @returns {TreeNode} The node after insertion
   * @private
   */
  _insertHelper(node, data) {
    if (data < node.data) {
      // Insert in left subtree
      if (node.left === null) {
        node.left = new TreeNode(data);
        this.size++;
      } else {
        this._insertHelper(node.left, data);
      }
    } else if (data > node.data) {
      // Insert in right subtree
      if (node.right === null) {
        node.right = new TreeNode(data);
        this.size++;
      } else {
        this._insertHelper(node.right, data);
      }
    }
    // If data equals node.data, do nothing (no duplicates)
  }

  /**
   * Search for a value in the tree
   * Traverses the tree following BST property to find a value.
   * Much faster than linear search due to logarithmic structure.
   * Time Complexity: O(log n) average, O(n) worst case
   * @param {*} data - The value to search for
   * @returns {boolean} True if value found, false otherwise
   */
  search(data) {
    return this._searchHelper(this.root, data);
  }

  /**
   * Helper method for search
   * Recursively searches for the value in the tree.
   * @param {TreeNode} node - Current node being examined
   * @param {*} data - The value to search for
   * @returns {boolean} True if found, false otherwise
   * @private
   */
  _searchHelper(node, data) {
    if (node === null) {
      return false;
    }

    if (data === node.data) {
      return true;
    } else if (data < node.data) {
      return this._searchHelper(node.left, data);
    } else {
      return this._searchHelper(node.right, data);
    }
  }

  /**
   * Delete a value from the tree
   * Removes a node while maintaining BST property.
   * Handles three cases: node has no children, one child, or two children.
   * Time Complexity: O(log n) average, O(n) worst case
   * @param {*} data - The value to delete
   * @returns {boolean} True if deleted, false if not found
   */
  delete(data) {
    const oldSize = this.size;
    this.root = this._deleteHelper(this.root, data);
    return this.size < oldSize;
  }

  /**
   * Helper method for delete
   * Recursively finds and removes the node.
   * @param {TreeNode} node - Current node being examined
   * @param {*} data - The value to delete
   * @returns {TreeNode} The modified subtree
   * @private
   */
  _deleteHelper(node, data) {
    if (node === null) {
      return null;
    }

    if (data < node.data) {
      node.left = this._deleteHelper(node.left, data);
    } else if (data > node.data) {
      node.right = this._deleteHelper(node.right, data);
    } else {
      // Node to delete found
      this.size--;

      // Case 1: No children (leaf node)
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2: One child
      if (node.left === null) {
        return node.right;
      }
      if (node.right === null) {
        return node.left;
      }

      // Case 3: Two children
      // Find the minimum value in the right subtree (inorder successor)
      let minRight = this._findMin(node.right);
      node.data = minRight;
      node.right = this._deleteHelper(node.right, minRight);
    }

    return node;
  }

  /**
   * Helper method to find minimum value in a subtree
   * Used for finding the inorder successor in deletion.
   * @param {TreeNode} node - The root of the subtree
   * @returns {*} The minimum value in the subtree
   * @private
   */
  _findMin(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node.data;
  }

  /**
   * Find the minimum value in the tree
   * The leftmost node contains the minimum value.
   * Time Complexity: O(log n) average, O(n) worst case
   * @returns {*} The minimum value, or null if tree is empty
   */
  findMin() {
    if (this.root === null) return null;
    let node = this.root;
    while (node.left !== null) {
      node = node.left;
    }
    return node.data;
  }

  /**
   * Find the maximum value in the tree
   * The rightmost node contains the maximum value.
   * Time Complexity: O(log n) average, O(n) worst case
   * @returns {*} The maximum value, or null if tree is empty
   */
  findMax() {
    if (this.root === null) return null;
    let node = this.root;
    while (node.right !== null) {
      node = node.right;
    }
    return node.data;
  }

  /**
   * Check if the tree is empty
   * Determines whether the tree contains any nodes.
   * Time Complexity: O(1) - Constant time
   * @returns {boolean} True if tree is empty, false otherwise
   */
  isEmpty() {
    return this.root === null;
  }

  /**
   * Get the number of nodes in the tree
   * Returns the size tracked during insertions/deletions.
   * Time Complexity: O(1) - Constant time
   * @returns {number} The total number of nodes
   */
  getSize() {
    return this.size;
  }

  /**
   * Get the height of the tree
   * Height is the longest path from root to a leaf.
   * Time Complexity: O(n) - Must traverse the tree
   * @returns {number} The height of the tree, or 0 if empty
   */
  getHeight() {
    return this._getHeightHelper(this.root);
  }

  /**
   * Helper method to get height
   * Recursively calculates the height of a subtree.
   * @param {TreeNode} node - The root of the subtree
   * @returns {number} The height of the subtree
   * @private
   */
  _getHeightHelper(node) {
    if (node === null) {
      return 0;
    }
    return 1 + Math.max(
      this._getHeightHelper(node.left),
      this._getHeightHelper(node.right)
    );
  }

  /**
   * Check if tree is balanced
   * A balanced tree has the height difference between left and right subtrees at most 1.
   * Time Complexity: O(n) - Must check all nodes
   * @returns {boolean} True if balanced, false otherwise
   */
  isBalanced() {
    return this._isBalancedHelper(this.root).balanced;
  }

  /**
   * Helper method to check balance
   * Returns both height and balance status.
   * @param {TreeNode} node - Current node being examined
   * @returns {Object} Object with balanced status and height
   * @private
   */
  _isBalancedHelper(node) {
    if (node === null) {
      return { balanced: true, height: 0 };
    }

    const left = this._isBalancedHelper(node.left);
    if (!left.balanced) return { balanced: false, height: 0 };

    const right = this._isBalancedHelper(node.right);
    if (!right.balanced) return { balanced: false, height: 0 };

    const balanced = Math.abs(left.height - right.height) <= 1;
    const height = 1 + Math.max(left.height, right.height);

    return { balanced, height };
  }

  /**
   * Inorder traversal (Left -> Root -> Right)
   * Produces values in sorted (ascending) order for BST.
   * Time Complexity: O(n) - Visits each node once
   * @returns {Array} Array of values in inorder sequence
   */
  inorderTraversal() {
    const result = [];
    this._inorderHelper(this.root, result);
    return result;
  }

  /**
   * Helper method for inorder traversal
   * @param {TreeNode} node - Current node being visited
   * @param {Array} result - Array to store results
   * @private
   */
  _inorderHelper(node, result) {
    if (node !== null) {
      this._inorderHelper(node.left, result);
      result.push(node.data);
      this._inorderHelper(node.right, result);
    }
  }

  /**
   * Preorder traversal (Root -> Left -> Right)
   * Useful for creating a copy of the tree.
   * Time Complexity: O(n) - Visits each node once
   * @returns {Array} Array of values in preorder sequence
   */
  preorderTraversal() {
    const result = [];
    this._preorderHelper(this.root, result);
    return result;
  }

  /**
   * Helper method for preorder traversal
   * @param {TreeNode} node - Current node being visited
   * @param {Array} result - Array to store results
   * @private
   */
  _preorderHelper(node, result) {
    if (node !== null) {
      result.push(node.data);
      this._preorderHelper(node.left, result);
      this._preorderHelper(node.right, result);
    }
  }

  /**
   * Postorder traversal (Left -> Right -> Root)
   * Useful for deleting a tree.
   * Time Complexity: O(n) - Visits each node once
   * @returns {Array} Array of values in postorder sequence
   */
  postorderTraversal() {
    const result = [];
    this._postorderHelper(this.root, result);
    return result;
  }

  /**
   * Helper method for postorder traversal
   * @param {TreeNode} node - Current node being visited
   * @param {Array} result - Array to store results
   * @private
   */
  _postorderHelper(node, result) {
    if (node !== null) {
      this._postorderHelper(node.left, result);
      this._postorderHelper(node.right, result);
      result.push(node.data);
    }
  }

  /**
   * Level order traversal (BFS)
   * Visits nodes level by level from top to bottom.
   * Time Complexity: O(n) - Visits each node once
   * @returns {Array} Array of values in level order
   */
  levelOrderTraversal() {
    if (this.root === null) return [];

    const result = [];
    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.data);

      if (node.left !== null) {
        queue.push(node.left);
      }
      if (node.right !== null) {
        queue.push(node.right);
      }
    }

    return result;
  }

  /**
   * Get all values in sorted order
   * Uses inorder traversal to get sorted values.
   * Time Complexity: O(n) - Single traversal
   * @returns {Array} Sorted array of all values
   */
  getSorted() {
    return this.inorderTraversal();
  }

  /**
   * Count total nodes in the tree
   * Recursively counts nodes in all subtrees.
   * Time Complexity: O(n) - Must visit all nodes
   * @returns {number} Total number of nodes
   */
  countNodes() {
    return this._countNodesHelper(this.root);
  }

  /**
   * Helper method to count nodes
   * @param {TreeNode} node - Current node being examined
   * @returns {number} Number of nodes in the subtree
   * @private
   */
  _countNodesHelper(node) {
    if (node === null) return 0;
    return 1 + this._countNodesHelper(node.left) + this._countNodesHelper(node.right);
  }

  /**
   * Count leaf nodes (nodes with no children)
   * Time Complexity: O(n) - Must visit all nodes
   * @returns {number} Number of leaf nodes
   */
  countLeafNodes() {
    return this._countLeafNodesHelper(this.root);
  }

  /**
   * Helper method to count leaf nodes
   * @param {TreeNode} node - Current node being examined
   * @returns {number} Number of leaf nodes in subtree
   * @private
   */
  _countLeafNodesHelper(node) {
    if (node === null) return 0;
    if (node.left === null && node.right === null) return 1;
    return this._countLeafNodesHelper(node.left) + this._countLeafNodesHelper(node.right);
  }

  /**
   * Clear the entire tree
   * Removes all nodes by resetting root.
   * Time Complexity: O(1) - Just reset the root
   */
  clear() {
    this.root = null;
    this.size = 0;
  }

  /**
   * Display tree structure visually
   * Shows a text representation of the tree structure.
   * Time Complexity: O(n) - Traverses entire tree
   */
  display() {
    if (this.root === null) {
      console.log("Tree: Empty");
      return;
    }
    this._displayHelper(this.root, "", true);
  }

  /**
   * Helper method for tree display
   * @param {TreeNode} node - Current node being displayed
   * @param {string} prefix - Prefix for formatting
   * @param {boolean} isRight - Whether node is a right child
   * @private
   */
  _displayHelper(node, prefix, isRight) {
    if (node !== null) {
      console.log(prefix + (isRight ? "├── " : "└── ") + node.data);
      if (node.left !== null || node.right !== null) {
        if (node.left !== null) {
          this._displayHelper(node.left, prefix + (isRight ? "│   " : "    "), false);
        }
        if (node.right !== null) {
          this._displayHelper(node.right, prefix + (isRight ? "│   " : "    "), true);
        }
      }
    }
  }

  /**
   * Print tree status
   * Displays comprehensive information about the tree.
   * Time Complexity: O(n) - Traverses entire tree
   */
  printStatus() {
    console.log("=== Tree Status ===");
    console.log("Size:", this.size);
    console.log("Height:", this.getHeight());
    console.log("Is Empty:", this.isEmpty());
    console.log("Is Balanced:", this.isBalanced());
    console.log("Min Value:", this.findMin());
    console.log("Max Value:", this.findMax());
    console.log("Leaf Nodes:", this.countLeafNodes());
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== BINARY SEARCH TREE DATA STRUCTURE =====\n");

// Create a new binary search tree
const bst = new BinarySearchTree();

// Insert elements
console.log("1. Inserting elements (50, 30, 70, 20, 40, 60, 80):");
[50, 30, 70, 20, 40, 60, 80].forEach(val => bst.insert(val));
bst.display();
console.log("   Size:", bst.getSize());

// Height
console.log("\n2. Tree height:", bst.getHeight());

// Min and Max
console.log("\n3. Min and Max values:");
console.log("   Minimum:", bst.findMin());
console.log("   Maximum:", bst.findMax());

// Search
console.log("\n4. Search operations:");
console.log("   Search for 40:", bst.search(40));
console.log("   Search for 100:", bst.search(100));

// Traversals
console.log("\n5. Tree traversals:");
console.log("   Inorder (sorted):", bst.inorderTraversal());
console.log("   Preorder:", bst.preorderTraversal());
console.log("   Postorder:", bst.postorderTraversal());
console.log("   Level order (BFS):", bst.levelOrderTraversal());

// Count nodes
console.log("\n6. Node counting:");
console.log("   Total nodes:", bst.countNodes());
console.log("   Leaf nodes:", bst.countLeafNodes());

// Balance check
console.log("\n7. Balance check:");
console.log("   Is balanced?", bst.isBalanced());

// Delete operations
console.log("\n8. Delete operations:");
console.log("   Before deletion - Size:", bst.getSize());
console.log("   Inorder:", bst.inorderTraversal());

console.log("\n   Deleting 20 (leaf node):");
bst.delete(20);
console.log("   After deletion - Size:", bst.getSize());
console.log("   Inorder:", bst.inorderTraversal());

console.log("\n   Deleting 30 (node with two children):");
bst.delete(30);
console.log("   After deletion - Size:", bst.getSize());
console.log("   Inorder:", bst.inorderTraversal());
bst.display();

// Unbalanced tree example
console.log("\n9. Unbalanced tree example:");
const unbalanced = new BinarySearchTree();
[10, 20, 30, 40, 50].forEach(val => unbalanced.insert(val));
console.log("   Tree (inserted in order - creates skewed tree):");
unbalanced.display();
console.log("   Height:", unbalanced.getHeight());
console.log("   Is balanced?", unbalanced.isBalanced());

// Status report
console.log("\n10. Tree status report:");
bst.printStatus();

// Sorted output
console.log("\n11. Get sorted values from tree:");
console.log("   Sorted:", bst.getSorted());

// Practical example: Range of values
console.log("\n12. Practical example - Finding range of values:");
const rangeBst = new BinarySearchTree();
[50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 65, 75, 90].forEach(val => rangeBst.insert(val));
console.log("   Tree values (sorted):", rangeBst.getSorted());
console.log("   Values >= 35 and <= 75:", rangeBst.getSorted().filter(v => v >= 35 && v <= 75));

// Clear tree
console.log("\n13. Clear the tree:");
const clearBst = new BinarySearchTree();
[1, 2, 3].forEach(val => clearBst.insert(val));
console.log("    Before clearing - Size:", clearBst.getSize());
clearBst.clear();
console.log("    After clearing - Size:", clearBst.getSize());
console.log("    Is empty?", clearBst.isEmpty());

console.log("\n===== END OF BINARY SEARCH TREE EXAMPLES =====");
