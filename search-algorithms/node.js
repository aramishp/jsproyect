class Node {
    constructor(value) {
        this.value = value;
        this.children = new Array();
    }

    addChildren(value) {
        this.children.push(new Node(value));
        return this;
    }
}