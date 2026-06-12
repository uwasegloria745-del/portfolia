/**
 * Graph Data Structure Implementation
 * A Graph is a collection of nodes (vertices) connected by edges.
 * This implementation uses adjacency lists for efficient storage.
 */

/**
 * Graph Class
 * Supports both directed and undirected graphs with weighted or unweighted edges.
 */
class Graph {
  /**
   * Constructor for Graph
   * @param {boolean} directed - Whether graph is directed (default: false)
   */
  constructor(directed = false) {
    this.adjacencyList = new Map();
    this.directed = directed;
  }

  /**
   * Add a vertex to the graph
   * Adds a new node without any edges.
   * Time Complexity: O(1) average
   * @param {*} vertex - The value representing the vertex
   */
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  /**
   * Add an edge between two vertices
   * Creates an edge from source to destination.
   * For undirected graphs, adds both directions.
   * Time Complexity: O(1) average
   * @param {*} source - The source vertex
   * @param {*} destination - The destination vertex
   * @param {number} weight - Optional edge weight
   */
  addEdge(source, destination, weight = 1) {
    this.addVertex(source);
    this.addVertex(destination);

    this.adjacencyList.get(source).push({ vertex: destination, weight });

    if (!this.directed) {
      this.adjacencyList.get(destination).push({ vertex: source, weight });
    }
  }

  /**
   * Remove an edge between two vertices
   * Deletes the edge from source to destination.
   * For undirected graphs, removes both directions.
   * Time Complexity: O(E) - Where E is number of edges in source adjacency
   * @param {*} source - The source vertex
   * @param {*} destination - The destination vertex
   */
  removeEdge(source, destination) {
    if (!this.adjacencyList.has(source) || !this.adjacencyList.has(destination)) {
      return;
    }

    this.adjacencyList.set(
      source,
      this.adjacencyList
        .get(source)
        .filter(edge => edge.vertex !== destination)
    );

    if (!this.directed) {
      this.adjacencyList.set(
        destination,
        this.adjacencyList
          .get(destination)
          .filter(edge => edge.vertex !== source)
      );
    }
  }

  /**
   * Remove a vertex and all connected edges
   * Also cleans up edges from other vertices.
   * Time Complexity: O(V + E) - Visits all adjacency lists
   * @param {*} vertex - The vertex to remove
   */
  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      return;
    }

    this.adjacencyList.delete(vertex);

    for (let [v, edges] of this.adjacencyList) {
      this.adjacencyList.set(
        v,
        edges.filter(edge => edge.vertex !== vertex)
      );
    }
  }

  /**
   * Check if the graph contains a vertex
   * Time Complexity: O(1) average
   * @param {*} vertex - The vertex to check
   * @returns {boolean} True if vertex exists, false otherwise
   */
  hasVertex(vertex) {
    return this.adjacencyList.has(vertex);
  }

  /**
   * Check if an edge exists between two vertices
   * Time Complexity: O(E) - Search adjacency list for source
   * @param {*} source - The source vertex
   * @param {*} destination - The destination vertex
   * @returns {boolean} True if edge exists, false otherwise
   */
  hasEdge(source, destination) {
    if (!this.adjacencyList.has(source)) {
      return false;
    }

    return this.adjacencyList.get(source).some(edge => edge.vertex === destination);
  }

  /**
   * Get all vertices in the graph
   * Time Complexity: O(V)
   * @returns {Array} Array of vertices
   */
  getVertices() {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Get adjacency list for a vertex
   * Time Complexity: O(1)
   * @param {*} vertex - The vertex
   * @returns {Array|null} Array of edges or null if vertex missing
   */
  getNeighbors(vertex) {
    return this.adjacencyList.has(vertex) ? this.adjacencyList.get(vertex) : null;
  }

  /**
   * Get total number of vertices
   * Time Complexity: O(1)
   * @returns {number} Count of vertices
   */
  getVertexCount() {
    return this.adjacencyList.size;
  }

  /**
   * Get total number of edges
   * For undirected graphs, counts each edge once.
   * Time Complexity: O(V + E)
   * @returns {number} Count of edges
   */
  getEdgeCount() {
    let count = 0;
    for (let edges of this.adjacencyList.values()) {
      count += edges.length;
    }
    return this.directed ? count : count / 2;
  }

  /**
   * Breadth First Search (BFS)
   * Visits nodes level by level starting from startVertex.
   * Time Complexity: O(V + E)
   * @param {*} startVertex - Starting vertex
   * @returns {Array} Array of visited vertices
   */
  bfs(startVertex) {
    if (!this.adjacencyList.has(startVertex)) {
      return [];
    }

    const visited = new Set();
    const queue = [startVertex];
    const result = [];

    visited.add(startVertex);

    while (queue.length > 0) {
      const vertex = queue.shift();
      result.push(vertex);

      for (let edge of this.adjacencyList.get(vertex)) {
        if (!visited.has(edge.vertex)) {
          visited.add(edge.vertex);
          queue.push(edge.vertex);
        }
      }
    }

    return result;
  }

  /**
   * Depth First Search (DFS)
   * Visits nodes deeply before backtracking.
   * Time Complexity: O(V + E)
   * @param {*} startVertex - Starting vertex
   * @returns {Array} Array of visited vertices
   */
  dfs(startVertex) {
    if (!this.adjacencyList.has(startVertex)) {
      return [];
    }

    const visited = new Set();
    const result = [];
    this._dfsHelper(startVertex, visited, result);
    return result;
  }

  /**
   * Helper method for DFS
   * @param {*} vertex - Current vertex
   * @param {Set} visited - Set of visited vertices
   * @param {Array} result - Array to store visited order
   * @private
   */
  _dfsHelper(vertex, visited, result) {
    visited.add(vertex);
    result.push(vertex);

    for (let edge of this.adjacencyList.get(vertex)) {
      if (!visited.has(edge.vertex)) {
        this._dfsHelper(edge.vertex, visited, result);
      }
    }
  }

  /**
   * Topological sort for DAGs
   * Returns a linear ordering of vertices for directed acyclic graphs.
   * Time Complexity: O(V + E)
   * @returns {Array|null} Topological order or null if cycle exists
   */
  topologicalSort() {
    if (!this.directed) {
      console.log("Topological sort only applies to directed graphs.");
      return null;
    }

    const visited = new Set();
    const temp = new Set();
    const stack = [];
    const vertices = this.getVertices();

    for (let vertex of vertices) {
      if (!visited.has(vertex)) {
        if (!this._topologicalSortHelper(vertex, visited, temp, stack)) {
          return null; // cycle detected
        }
      }
    }

    return stack.reverse();
  }

  /**
   * Helper method for topological sort
   * @param {*} vertex - Current vertex
   * @param {Set} visited - Permanently visited vertices
   * @param {Set} temp - Temporarily visited vertices in recursion stack
   * @param {Array} stack - Order stack
   * @returns {boolean} True if no cycle, false if cycle detected
   * @private
   */
  _topologicalSortHelper(vertex, visited, temp, stack) {
    if (temp.has(vertex)) {
      return false; // cycle found
    }

    if (!visited.has(vertex)) {
      temp.add(vertex);
      visited.add(vertex);

      for (let edge of this.adjacencyList.get(vertex)) {
        if (!this._topologicalSortHelper(edge.vertex, visited, temp, stack)) {
          return false;
        }
      }

      temp.delete(vertex);
      stack.push(vertex);
    }

    return true;
  }

  /**
   * Detect cycle in the graph
   * Works for both directed and undirected graphs.
   * Time Complexity: O(V + E)
   * @returns {boolean} True if cycle detected, false otherwise
   */
  hasCycle() {
    const visited = new Set();
    const recursionStack = new Set();

    for (let vertex of this.getVertices()) {
      if (!visited.has(vertex)) {
        if (this.directed) {
          if (this._detectCycleDirected(vertex, visited, recursionStack)) {
            return true;
          }
        } else {
          if (this._detectCycleUndirected(vertex, visited, null)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Helper method to detect cycle in directed graph
   * @param {*} vertex - Current vertex
   * @param {Set} visited - Visited vertices
   * @param {Set} recursionStack - Vertices in current recursion stack
   * @returns {boolean} True if cycle exists
   * @private
   */
  _detectCycleDirected(vertex, visited, recursionStack) {
    visited.add(vertex);
    recursionStack.add(vertex);

    for (let edge of this.adjacencyList.get(vertex)) {
      if (!visited.has(edge.vertex)) {
        if (this._detectCycleDirected(edge.vertex, visited, recursionStack)) {
          return true;
        }
      } else if (recursionStack.has(edge.vertex)) {
        return true;
      }
    }

    recursionStack.delete(vertex);
    return false;
  }

  /**
   * Helper method to detect cycle in undirected graph
   * @param {*} vertex - Current vertex
   * @param {Set} visited - Visited vertices
   * @param {*} parent - Parent of current vertex
   * @returns {boolean} True if cycle exists
   * @private
   */
  _detectCycleUndirected(vertex, visited, parent) {
    visited.add(vertex);

    for (let edge of this.adjacencyList.get(vertex)) {
      if (!visited.has(edge.vertex)) {
        if (this._detectCycleUndirected(edge.vertex, visited, vertex)) {
          return true;
        }
      } else if (edge.vertex !== parent) {
        return true;
      }
    }

    return false;
  }

  /**
   * Dijkstra's shortest path algorithm
   * Computes shortest path distances from start vertex in weighted graph.
   * Time Complexity: O((V + E) log V) with priority queue
   * @param {*} startVertex - Starting vertex
   * @returns {Object} Distances map from start to each vertex
   */
  dijkstra(startVertex) {
    if (!this.adjacencyList.has(startVertex)) {
      return {};
    }

    const distances = {};
    const visited = new Set();
    const priorityQueue = new PriorityQueue();

    for (let vertex of this.getVertices()) {
      distances[vertex] = Infinity;
    }
    distances[startVertex] = 0;
    priorityQueue.enqueue(startVertex, 0);

    while (!priorityQueue.isEmpty()) {
      const { value: currentVertex } = priorityQueue.dequeue();
      visited.add(currentVertex);

      for (let edge of this.adjacencyList.get(currentVertex)) {
        if (visited.has(edge.vertex)) continue;

        const newDist = distances[currentVertex] + edge.weight;
        if (newDist < distances[edge.vertex]) {
          distances[edge.vertex] = newDist;
          priorityQueue.enqueue(edge.vertex, newDist);
        }
      }
    }

    return distances;
  }

  /**
   * Display adjacency list
   * Prints the graph structure with all vertices and edges.
   * Time Complexity: O(V + E)
   */
  display() {
    for (let [vertex, edges] of this.adjacencyList) {
      const edgeList = edges.map(edge => `${edge.vertex}${edge.weight !== 1 ? `(${edge.weight})` : ""}`);
      console.log(`${vertex} -> ${edgeList.join(', ')}`);
    }
  }

  /**
   * Print graph status
   * Displays summary information about the graph.
   * Time Complexity: O(V + E)
   */
  printStatus() {
    console.log("=== Graph Status ===");
    console.log("Directed:", this.directed);
    console.log("Vertices:", this.getVertexCount());
    console.log("Edges:", this.getEdgeCount());
    console.log("Has cycle:", this.hasCycle());
  }
}

/**
 * Priority Queue (Min-Heap) Implementation
 * Used by Dijkstra's algorithm for selecting the next closest vertex.
 */
class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  /**
   * Enqueue a value with priority
   * Time Complexity: O(log n)
   * @param {*} value - The value to enqueue
   * @param {number} priority - The priority associated with the value
   */
  enqueue(value, priority) {
    this.heap.push({ value, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  /**
   * Dequeue the element with smallest priority
   * Time Complexity: O(log n)
   * @returns {*} The dequeued element
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
   * Check if queue is empty
   * Time Complexity: O(1)
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Bubble up element to restore heap property
   * @param {number} index - Index to bubble up
   * @private
   */
  _bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].priority >= this.heap[parentIndex].priority) {
        break;
      }
      this._swap(index, parentIndex);
      index = parentIndex;
    }
  }

  /**
   * Bubble down element to restore heap property
   * @param {number} index - Index to bubble down
   * @private
   */
  _bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }
      this._swap(index, smallest);
      index = smallest;
    }
  }

  /**
   * Swap two elements in the heap
   * @param {number} i - First index
   * @param {number} j - Second index
   * @private
   */
  _swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== GRAPH DATA STRUCTURE =====\n");

// Undirected graph example
const graph = new Graph(false);

console.log("1. Build undirected graph:");
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'D');
graph.addEdge('C', 'E');

graph.display();
console.log("   Vertices:", graph.getVertexCount());
console.log("   Edges:", graph.getEdgeCount());
console.log("   Has cycle:", graph.hasCycle());

console.log("\n2. BFS from A:", graph.bfs('A'));
console.log("   DFS from A:", graph.dfs('A'));

console.log("\n3. Directed graph example with topological sort:");
const directedGraph = new Graph(true);
directedGraph.addEdge('A', 'B');
directedGraph.addEdge('A', 'C');
directedGraph.addEdge('B', 'D');
directedGraph.addEdge('C', 'D');
directedGraph.addEdge('D', 'E');

directedGraph.display();
console.log("   Topological sort:", directedGraph.topologicalSort());
console.log("   Cycle detected:", directedGraph.hasCycle());

console.log("\n4. Directed graph with cycle detection:");
const cyclicGraph = new Graph(true);
cyclicGraph.addEdge('A', 'B');
cyclicGraph.addEdge('B', 'C');
cyclicGraph.addEdge('C', 'A');
cyclicGraph.display();
console.log("   Has cycle:", cyclicGraph.hasCycle());

console.log("\n5. Weighted graph + Dijkstra's shortest path:");
const weightedGraph = new Graph(true);
weightedGraph.addEdge('A', 'B', 4);
weightedGraph.addEdge('A', 'C', 2);
weightedGraph.addEdge('B', 'C', 5);
weightedGraph.addEdge('B', 'D', 10);
weightedGraph.addEdge('C', 'E', 3);
weightedGraph.addEdge('E', 'D', 4);
weightedGraph.addEdge('D', 'F', 11);
weightedGraph.display();
console.log("   Shortest distances from A:", weightedGraph.dijkstra('A'));

console.log("\n6. Graph status:");
weightedGraph.printStatus();

console.log("\n===== END OF GRAPH EXAMPLES =====");
