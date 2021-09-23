export default class VOD {
    url: string;
    constructor(value: string) {
        this.url = value;
    }

    public toString() {
        return this.url;
    }
}