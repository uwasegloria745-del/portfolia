/**
 * Set Data Structure Implementation
 * A Set stores unique values and supports membership, addition, removal, and set operations.
 */

/**
 * SetDataStructure Class
 * Implements a set using a JavaScript object and provides set algebra operations.
 */
class SetDataStructure {
  /**
   * Constructor for SetDataStructure
   */
  constructor() {
    this.items = {};
    this.size = 0;
  }

  /**
   * Add a value to the set
   * If the value already exists, it is not added again.
   * Time Complexity: O(1)
   * @param {*} value - The value to add
   */
  add(value) {
    const key = this._serialize(value);
    if (!this.items.hasOwnProperty(key)) {
      this.items[key] = value;
      this.size++;
    }
  }

  /**
   * Remove a value from the set
   * Time Complexity: O(1)
   * @param {*} value - The value to remove
   * @returns {boolean} True if removed, false if not present
   */
  remove(value) {
    const key = this._serialize(value);
    if (this.items.hasOwnProperty(key)) {
      delete this.items[key];
      this.size--;
      return true;
    }
    return false;
  }

  /**
   * Check if the set contains a value
   * Time Complexity: O(1)
   * @param {*} value - The value to check
   * @returns {boolean} True if value exists, false otherwise
   */
  contains(value) {
    return this.items.hasOwnProperty(this._serialize(value));
  }

  /**
   * Get value count in the set
   * Time Complexity: O(1)
   * @returns {number} Number of unique values
   */
  getSize() {
    return this.size;
  }

  /**
   * Check if set is empty
   * Time Complexity: O(1)
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Clear all values from the set
   * Time Complexity: O(1)
   */
  clear() {
    this.items = {};
    this.size = 0;
  }

  /**
   * Return all values as an array
   * Time Complexity: O(n)
   * @returns {Array} Array of all values
   */
  values() {
    return Object.values(this.items);
  }

  /**
   * Union of two sets
   * Returns a new set with elements from both sets.
   * Time Complexity: O(n + m)
   * @param {SetDataStructure} otherSet - The other set
   * @returns {SetDataStructure} New union set
   */
  union(otherSet) {
    const unionSet = new SetDataStructure();
    this.values().forEach(value => unionSet.add(value));
    otherSet.values().forEach(value => unionSet.add(value));
    return unionSet;
  }

  /**
   * Intersection of two sets
   * Returns a new set with elements common to both sets.
   * Time Complexity: O(n + m)
   * @param {SetDataStructure} otherSet - The other set
   * @returns {SetDataStructure} New intersection set
   */
  intersection(otherSet) {
    const intersectionSet = new SetDataStructure();
    this.values().forEach(value => {
      if (otherSet.contains(value)) {
        intersectionSet.add(value);
      }
    });
    return intersectionSet;
  }

  /**
   * Difference of two sets
   * Returns a new set with values in this set but not in otherSet.
   * Time Complexity: O(n + m)
   * @param {SetDataStructure} otherSet - The other set
   * @returns {SetDataStructure} New difference set
   */
  difference(otherSet) {
    const differenceSet = new SetDataStructure();
    this.values().forEach(value => {
      if (!otherSet.contains(value)) {
        differenceSet.add(value);
      }
    });
    return differenceSet;
  }

  /**
   * Symmetric difference of two sets
   * Returns values that are in exactly one set.
   * Time Complexity: O(n + m)
   * @param {SetDataStructure} otherSet - The other set
   * @returns {SetDataStructure} New symmetric difference set
   */
  symmetricDifference(otherSet) {
    const symmetricSet = new SetDataStructure();
    this.values().forEach(value => {
      if (!otherSet.contains(value)) {
        symmetricSet.add(value);
      }
    });
    otherSet.values().forEach(value => {
      if (!this.contains(value)) {
        symmetricSet.add(value);
      }
    });
    return symmetricSet;
  }

  /**
   * Check if this set is a subset of another
   * Time Complexity: O(n)
   * @param {SetDataStructure} otherSet - The other set
   * @returns {boolean} True if subset, false otherwise
   */
  isSubsetOf(otherSet) {
    return this.values().every(value => otherSet.contains(value));
  }

  /**
   * Serialize a value to a string key for storage
   * @param {*} value - Value to serialize
   * @returns {string} Serialized key
   * @private
   */
  _serialize(value) {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return `${typeof value}:${String(value)}`;
  }

  /**
   * Print set values
   * Time Complexity: O(n)
   */
  display() {
    console.log(`Set: { ${this.values().join(', ')} }`);
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== SET DATA STRUCTURE =====\n");
const setA = new SetDataStructure();
setA.add(1);
setA.add(2);
setA.add(3);
setA.add(2); // duplicate ignored

console.log("1. Set A values:");
setA.display();
console.log("   Size:", setA.getSize());

const setB = new SetDataStructure();
setB.add(2);
setB.add(3);
setB.add(4);

console.log("\n2. Set B values:");
setB.display();

console.log("\n3. Union:");
setA.union(setB).display();

console.log("\n4. Intersection:");
setA.intersection(setB).display();

console.log("\n5. Difference A - B:");
setA.difference(setB).display();

console.log("\n6. Symmetric Difference:");
setA.symmetricDifference(setB).display();

console.log("\n7. Subset checks:");
console.log("   setA is subset of setB?", setA.isSubsetOf(setB));
console.log("   setB is subset of setA?", setB.isSubsetOf(setA));

console.log("\n8. Contains checks:");
console.log("   setA contains 2?", setA.contains(2));
console.log("   setA contains 5?", setA.contains(5));

console.log("\n9. Remove value:");
setA.remove(1);
setA.display();
console.log("   Size:", setA.getSize());

console.log("\n===== END OF SET EXAMPLES =====");