/**
 * Copyright (c) 2019 Adrian Mejia
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 */

const BinaryTreeNode = require('./BinaryTreeNode');
const Queue = require('./Queue');
const Stack = require('./Stack');
// tag::snippet[]
class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  // end::snippet[]

  // tag::add[]
  /**
   * Insert value on the BST.
   *
   * If the value is already in the tree,
   * then it increases the multiplicity value
   * @param {any} value node's value to insert in the tree
   * @returns {BinaryTreeNode} newly added node
   */
  add(value) {
    let node = new BinaryTreeNode(value);

    if (this.root) {
      const { found, parent } = this.findNodeAndParent(value); // <1>
      if (found) { // duplicated: value already exist on the tree
        found.meta.multiplicity = (found.meta.multiplicity || 1) + 1; // <2>
        node = found;
      } else if (value < parent.value) {
        parent.setLeftAndUpdateParent(node);
      } else {
        parent.setRightAndUpdateParent(node);
      }
    } else {
      this.root = node;
    }

    this.size += 1;
    return node;
  }
  // end::add[]

  /**
   * Find if a node is present or not
   * @param {any} value node to find
   * @returns {boolean} true if is present, false otherwise
   */
  has(value) {
    return !!this.find(value);
  }

  // tag::find[]
  /**
   * @param {any} value value to find
   * @returns {BinaryTreeNode|null} node if it found it or null if not
   */
  find(value) {
    return this.findNodeAndParent(value).found;
  }


  /**
   * Recursively finds the node matching the value.
   * If it doesn't find, it returns the leaf `parent` where the new value should be appended.
   * @param {any} value Node's value to find
   * @param {BinaryTreeNode} node first element to start the search (root is default)
   * @param {BinaryTreeNode} parent keep track of parent (usually filled by recursion)
   * @returns {object} node and its parent like {node, parent}
   */
  findNodeAndParent(value, node = this.root, parent = null) {
    if (!node || node.value === value) {
      return { found: node, parent };
    } if (value < node.value) {
      return this.findNodeAndParent(value, node.left, node);
    }
    return this.findNodeAndParent(value, node.right, node);
  }
  // end::find[]

  /**
   * Get the node with the max value of subtree: the right-most value.
   * @param {BinaryTreeNode} node subtree's root
   * @returns {BinaryTreeNode} right-most node (max value)
   */
  getRightmost(node = this.root) {
    if (!node || !node.right) {
      return node;
    }
    return this.getMax(node.right);
  }

  // tag::leftMost[]
  /**
   * Get the node with the min value of subtree: the left-most value.
   * @param {BinaryTreeNode} node subtree's root
   * @returns {BinaryTreeNode} left-most node (min value)
   */
  getLeftmost(node = this.root) {
    if (!node || !node.left) {
      return node;
    }
    return this.getMin(node.left);
  }
  // end::leftMost[]


  // tag::remove[]
  /**
   * Remove a node from the tree
   * @returns {boolean} false if not found and true if it was deleted
   */
  remove(value) {
    const { found: nodeToRemove, parent } = this.findNodeAndParent(value); // <1>

    if (!nodeToRemove) return false; // <2>

    // Combine left and right children into one subtree without nodeToRemove
    const removedNodeChildren = this.combineLeftIntoRightSubtree(nodeToRemove); // <3>

    if (nodeToRemove.meta.multiplicity && nodeToRemove.meta.multiplicity > 1) { // <4>
      nodeToRemove.meta.multiplicity -= 1; // handles duplicated
    } else if (nodeToRemove === this.root) { // <5>
      // Replace (root) node to delete with the combined subtree.
      this.root = removedNodeChildren;
      if (this.root) { this.root.parent = null; } // clearing up old parent
    } else if (nodeToRemove.isParentLeftChild) { // <6>
      // Replace node to delete with the combined subtree.
      parent.setLeftAndUpdateParent(removedNodeChildren);
    } else {
      parent.setRightAndUpdateParent(removedNodeChildren);
    }

    this.size -= 1;
    return true;
  }
  // end::remove[]

  // tag::combine[]
  /**
   * Combine left into right children into one subtree without given parent node.
   *
   * @example combineLeftIntoRightSubtree(30)
   *
   *      30*                             40
   *    /     \                          /  \
   *   10      40      combined        35   50
   *     \    /  \    ---------->     /
   *     15  35   50                 10
   *                                   \
   *                                    15
   *
   * It takes node 30 left subtree (10 and 15) and put it in the
   * leftmost node of the right subtree (40, 35, 50).
   *
   * @param {BinaryTreeNode} node
   * @returns {BinaryTreeNode} combined subtree
   */
  combineLeftIntoRightSubtree(node) {
    if (node.right) {
      const leftmost = this.getLeftmost(node.right);
      leftmost.setLeftAndUpdateParent(node.left);
      return node.right;
    }
    return node.left;
  }
  // end::combine[]

  // tag::bfs[]
  /**
   * Breath-first search for a tree (always starting from the root element).
   * @yields {BinaryTreeNode}
   */
  * bfs() {
    const queue = new Queue();

    queue.add(this.root);

    while (!queue.isEmpty()) {
      const node = queue.remove();
      yield node;

      if (node.left) { queue.add(node.left); }
      if (node.right) { queue.add(node.right); }
    }
  }
  // end::bfs[]

  // tag::dfs[]
  /**
   * Depth-first search for a tree (always starting from the root element)
   * @see preOrderTraversal Similar results to the pre-order transversal.
   * @yields {BinaryTreeNode}
   */
  * dfs() {
    const stack = new Stack();

    stack.add(this.root);

    while (!stack.isEmpty()) {
      const node = stack.remove();
      yield node;

      if (node.right) { stack.add(node.right); }
      if (node.left) { stack.add(node.left); }
    }
  }
  // end::dfs[]

  // tag::inOrderTraversal[]
  /**
   * In-order traversal on a tree: left-root-right.
   * If the tree is a BST, then the values will be sorted in ascendent order
   * @param {BinaryTreeNode} node first node to start the traversal
   * @yields {BinaryTreeNode}
   */
  * inOrderTraversal(node = this.root) {
    if (node && node.left) { yield* this.inOrderTraversal(node.left); }
    yield node;
    if (node && node.right) { yield* this.inOrderTraversal(node.right); }
  }
  // end::inOrderTraversal[]

  // tag::preOrderTraversal[]
  /**
   * Pre-order traversal on a tree: root-left-right.
   * Similar results to DFS
   * @param {BinaryTreeNode} node first node to start the traversal
   * @yields {BinaryTreeNode}
   */
  * preOrderTraversal(node = this.root) {
    yield node;
    if (node.left) { yield* this.preOrderTraversal(node.left); }
    if (node.right) { yield* this.preOrderTraversal(node.right); }
  }
  // end::preOrderTraversal[]

  // tag::postOrderTraversal[]
  /**
   * Post-order traversal on a tree: left-right-root.
   * @param {BinaryTreeNode} node first node to start the traversal
   * @yields {BinaryTreeNode}
   */
  * postOrderTraversal(node = this.root) {
    if (node.left) { yield* this.postOrderTraversal(node.left); }
    if (node.right) { yield* this.postOrderTraversal(node.right); }
    yield node;
  }
  // end::postOrderTraversal[]

  /**
   * Represent Binary Tree as an array.
   *
   * Leaf nodes will have two `undefined` descendants.
   *
   * The array representation of the binary tree is as follows:
   *
   * First element (index=0) is the root.
   * The following two elements (index=1,2) are descendants of the root: left (a) and right (b).
   * The next two elements (index=3,4) are the descendants of a
   * The next two elements (index=5,6) are the descendants of b and so on.
   *
   *  0     1            2             3       4        5       6        n
   * [root, a=root.left, b=root.right, a.left, a.right, b.left, b.right, ...]
   *
   * You can also find the parents as follows
   *
   * e.g.
   * Parent 0: children 1,2
   * Parent 1: children 3,4
   * Parent 2: children 5,6
   * Parent 3: children 7,8
   *
   * Given any index you can find the parent index with the following formula:
   *
   * parent = (index) => Math.floor((index-1)/2)
   */
  toArray() {
    const array = [];
    const queue = new Queue();
    const visited = new Map();

    if (this.root) { queue.add(this.root); }

    while (!queue.isEmpty()) {
      const current = queue.remove();
      array.push(current && current.value);

      if (current) { visited.set(current); }

      if (current && !visited.has(current.left)) { queue.add(current.left); }
      if (current && !visited.has(current.right)) { queue.add(current.right); }
    }

    return array;
  }
}

// aliases
BinarySearchTree.prototype.insert = BinarySearchTree.prototype.add;
BinarySearchTree.prototype.set = BinarySearchTree.prototype.add;
BinarySearchTree.prototype.delete = BinarySearchTree.prototype.remove;
BinarySearchTree.prototype.getMin = BinarySearchTree.prototype.getLeftmost;
BinarySearchTree.prototype.minimum = BinarySearchTree.prototype.getMin;
BinarySearchTree.prototype.getMax = BinarySearchTree.prototype.getRightmost;
BinarySearchTree.prototype.maximum = BinarySearchTree.prototype.getMax;
BinarySearchTree.prototype.get = BinarySearchTree.prototype.find;

module.exports = BinarySearchTree;
