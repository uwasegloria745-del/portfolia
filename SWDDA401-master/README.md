# Data Structures Study Project

A JavaScript learning repository with implementations of common data structures. Each file is written to help you understand how the structure works, how its methods behave, and how to test it by yourself.

## Why This Project Helps

- Learn the basics of data organization and access patterns
- Compare how arrays, lists, trees, graphs, and hashes differ
- Understand insertion, deletion, search, and traversal operations
- Practice with simple JavaScript examples and extend them
- Build confidence by modifying code and observing results

## Files Included

- `LinkedList.js`
  - Singly linked list with `head` and `tail`.
  - Methods: insert, delete, search, reverse, cycle detection, and utilities.

- `ArrayDataStructure.js`
  - Dynamic array implementation.
  - Methods: add, remove, search, sort, rotate, shuffle, and statistics.

- `QueueDataStructure.js`
  - Queue using linked nodes.
  - Methods: enqueue, dequeue, peek, rotate, search, and helpers.

- `StackDataStructure.js`
  - Stack using linked nodes.
  - Methods: push, pop, peek, search, reverse string, balanced brackets, and recursion simulation.

- `TreeDataStructure.js`
  - Binary search tree (BST).
  - Methods: insert, search, delete, traversals, height, balance check, and reporting.

- `GraphDataStructure.js`
  - Graph with adjacency lists.
  - Methods: add nodes and edges, BFS, DFS, cycle detection, topological sort, and shortest path.

- `HashTableDataStructure.js`
  - Hash table with separate chaining.
  - Methods: put, get, remove, resize, collision handling, and key/value helpers.

- `PriorityQueueDataStructure.js`
  - Min-heap priority queue.
  - Methods: enqueue, dequeue, peek, and heap maintenance.

- `PriorityQueueSearchOperations.js`
  - Priority queue helper methods.
  - Methods: contains, findPriority, and findAllByPriority.

- `SetDataStructure.js`
  - Set of unique values.
  - Methods: add, remove, union, intersection, difference, symmetric difference, and subset check.

- `TrieDataStructure.js`
  - Trie (prefix tree).
  - Methods: insert, search, prefix matching, delete, and prefix lookup.

## Quick Start

1. Open the project folder in your editor.
2. Open a terminal in this directory.
3. Run a file with Node.js:
   - `node LinkedList.js`
   - `node ArrayDataStructure.js`
4. Read the output and the comments in the file.

## Use the README to Improve Your Work

- Start with the file list and pick one structure to study.
- Run the example file and review how the code works.
- Edit the file to add more cases or test edge conditions.
- Write down what each method does and why it is useful.
- Use the study tasks below as a practice checklist.

## Suggested Learning Path

1. Begin with: `ArrayDataStructure.js`, `StackDataStructure.js`, `QueueDataStructure.js`
2. Continue with: `LinkedList.js`, `TreeDataStructure.js`
3. Finish with: `GraphDataStructure.js`, `HashTableDataStructure.js`, `TrieDataStructure.js`

## Practical Study Tasks

- For each file, answer:
  - What does this structure store?
  - How does insertion work?
  - How does deletion work?
  - What is one real-world example?

- Create a small test plan for each file:
  - Add at least 5 values.
  - Search for an existing value and a missing value.
  - Delete one item and verify the result.
  - Print the final structure state.

- Modify one implementation:
  - Convert `QueueDataStructure.js` to use an array instead of linked nodes.
  - Add `min()` and `max()` to `ArrayDataStructure.js`.
  - Add `findAllWithPrefix()` to `TrieDataStructure.js`.

## Learning Tips

- Read one file at a time.
- Use comments to understand each step.
- If something looks hard, draw a small example on paper.
- Compare operation costs: O(1), O(n), O(log n), O(n^2).
- Change values in the examples and rerun the code.

## Final Advice

This project is for learning by doing. Use the examples, then make them your own with additional tests and improvements. The best work comes from understanding the structure deeply and practicing with real examples.
