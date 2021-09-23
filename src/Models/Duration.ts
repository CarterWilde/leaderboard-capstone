export default class Duration {
    private value: number;
    constructor(value: string | number) {
        if (typeof(value) === "number") {
            this.value = value;
        }
        else if (typeof(value) === "string") {
            const [success, result] = this.toSeconds(value);
            if(success) {
                this.value = result;
            } else {
                throw new Error("Unable to parse value!");
            }
        } else {
            throw new Error("Invalid value!");
        }
    }

    toSeconds(duration: string): [boolean, number] {
        try {
            const values = {
                minutes: parseInt(duration.split(':')[0]),
                seconds: parseInt(duration.split(':')[1].split('.')[0]),
                milli: parseInt(duration.split(':')[1].split('.')[1]) * 10
            }
            return [true, (values.minutes * 60) + values.seconds + (values.milli / 1000)];
        } catch (e) {
            return [false, 0];
        }
    }

    toDurationString(seconds: number) : string {
        const minutes = Math.trunc(seconds / 60);
        const secs = seconds % 60;
        const addSecondsPrefix = (secs < 10);
        const addMinutesPrefix = (minutes < 10);
        return `${addMinutesPrefix ? "0"+(minutes):(minutes)}:${addSecondsPrefix ? "0"+(secs.toFixed(2)):(secs.toFixed(2))}`;
    }

    public toString() {
        return this.toDurationString(this.value);
    }
}