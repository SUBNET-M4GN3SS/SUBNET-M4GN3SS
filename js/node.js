export class Node {
    constructor(name, page, status, connectedNodes, files) {
        this.name = name;
        this.page = page;
        this.status = status;
        this.connectedNodes = connectedNodes;
        this.files = files;
    }
}