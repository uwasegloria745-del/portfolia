/**
 * Trie Data Structure Implementation
 * A Trie (prefix tree) stores strings efficiently and supports prefix search.
 */

/**
   * TrieNode Class
   * Represents a node in the trie with children and end-of-word flag.
   */
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

/**
 * Trie Class
 * Implements insertion, search, prefix matching, and deletion.
 */
class Trie {
  /**
   * Constructor for Trie
   */
  constructor() {
    this.root = new TrieNode();
    this.wordCount = 0;
  }

  /**
   * Insert a word into the trie
   * Time Complexity: O(k) where k is word length
   * @param {string} word - The word to insert
   */
  insert(word) {
    let current = this.root;

    for (let char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }

    if (!current.isEndOfWord) {
      current.isEndOfWord = true;
      this.wordCount++;
    }
  }

  /**
   * Search for a complete word
   * Time Complexity: O(k)
   * @param {string} word - The word to search
   * @returns {boolean} True if word exists, false otherwise
   */
  search(word) {
    let current = this.root;

    for (let char of word) {
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }

    return current.isEndOfWord;
  }

  /**
   * Check if a prefix exists
   * Time Complexity: O(k)
   * @param {string} prefix - The prefix to check
   * @returns {boolean} True if prefix exists, false otherwise
   */
  startsWith(prefix) {
    let current = this.root;

    for (let char of prefix) {
      if (!current.children[char]) {
        return false;
      }
      current = current.children[char];
    }

    return true;
  }

  /**
   * Delete a word from the trie
   * Uses recursion to remove nodes only when they are no longer needed.
   * Time Complexity: O(k)
   * @param {string} word - The word to delete
   * @returns {boolean} True if deleted, false if not found
   */
  delete(word) {
    if (!this.search(word)) {
      return false;
    }

    const deleted = this._deleteHelper(this.root, word, 0);
    if (deleted) {
      this.wordCount--;
    }
    return deleted;
  }

  /**
   * Helper method for delete
   * @private
   */
  _deleteHelper(node, word, index) {
    if (index === word.length) {
      if (!node.isEndOfWord) {
        return false;
      }
      node.isEndOfWord = false;
      return Object.keys(node.children).length === 0;
    }

    const char = word[index];
    const child = node.children[char];
    if (!child) {
      return false;
    }

    const shouldDeleteChild = this._deleteHelper(child, word, index + 1);

    if (shouldDeleteChild) {
      delete node.children[char];
      return !node.isEndOfWord && Object.keys(node.children).length === 0;
    }

    return false;
  }

  /**
   * Get all words in the trie
   * Time Complexity: O(n * k) where n is number of words, k average length
   * @returns {Array} Array of stored words
   */
  getAllWords() {
    const result = [];
    this._collectWords(this.root, '', result);
    return result;
  }

  /**
   * Helper method to collect words recursively
   * @private
   */
  _collectWords(node, prefix, result) {
    if (node.isEndOfWord) {
      result.push(prefix);
    }

    for (let char in node.children) {
      this._collectWords(node.children[char], prefix + char, result);
    }
  }

  /**
   * Get words that start with a prefix
   * Time Complexity: O(n * k) for collecting words after prefix match
   * @param {string} prefix - The prefix to search
   * @returns {Array} Array of words with the prefix
   */
  getWordsWithPrefix(prefix) {
    let current = this.root;

    for (let char of prefix) {
      if (!current.children[char]) {
        return [];
      }
      current = current.children[char];
    }

    const result = [];
    this._collectWords(current, prefix, result);
    return result;
  }

  /**
   * Count stored words
   * Time Complexity: O(1)
   * @returns {number} Number of words in the trie
   */
  getWordCount() {
    return this.wordCount;
  }

  /**
   * Check if trie is empty
   * Time Complexity: O(1)
   * @returns {boolean} True if empty, false otherwise
   */
  isEmpty() {
    return this.wordCount === 0;
  }

  /**
   * Print all words in the trie
   * Time Complexity: O(n * k)
   */
  display() {
    console.log(`Trie words: ${this.getAllWords().join(', ')}`);
  }
}

// ============== EXAMPLE USAGE ==============

console.log("===== TRIE DATA STRUCTURE =====\n");
const trie = new Trie();

console.log("1. Insert words into trie:");
['apple', 'app', 'apt', 'bat', 'batch', 'bath', 'banana'].forEach(word => trie.insert(word));
trie.display();
console.log("   Word count:", trie.getWordCount());

console.log("\n2. Search for words:");
console.log("   'app' exists?", trie.search('app'));
console.log("   'apple' exists?", trie.search('apple'));
console.log("   'apply' exists?", trie.search('apply'));

console.log("\n3. Prefix checks:");
console.log("   Starts with 'ap'?", trie.startsWith('ap'));
console.log("   Starts with 'bat'?", trie.startsWith('bat'));
console.log("   Starts with 'cat'?", trie.startsWith('cat'));

console.log("\n4. Get words with prefix 'ap':", trie.getWordsWithPrefix('ap'));
console.log("   Get words with prefix 'ba':", trie.getWordsWithPrefix('ba'));

console.log("\n5. Delete a word and verify:");
console.log("   Delete 'apt':", trie.delete('apt'));
console.log("   'apt' exists?", trie.search('apt'));
console.log("   Words with prefix 'ap':", trie.getWordsWithPrefix('ap'));
console.log("   Word count:", trie.getWordCount());

console.log("\n6. Delete non-existing word:", trie.delete('cat'));

console.log("\n7. Check empty status and clear:");
console.log("   Trie empty?", trie.isEmpty());

console.log("\n===== END OF TRIE EXAMPLES =====");