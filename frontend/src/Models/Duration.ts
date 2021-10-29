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

    toDurationString() : string {
			const [HourConversion, MinuteConversion, SecondsConversion] = [60 * 60 * 1000, 60 * 1000, 1000];
			const [HH, MM, SS] = [
				this.value / HourConversion,
				(this.value % HourConversion) / MinuteConversion,
				((this.value % HourConversion) % MinuteConversion) / SecondsConversion
			];
			return `${Math.trunc(HH).toString().padStart(2, '0')}:${Math.trunc(MM).toString().padStart(2, '0')}:${SS.toString().padStart(2, '0')}`;
    }

    public toString() {
        return this.toDurationString();
    }
}