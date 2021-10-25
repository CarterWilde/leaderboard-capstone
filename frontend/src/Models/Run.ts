import Ruleset from "./Ruleset";
import ColumnValue from "./ColumnValue";
import Runner from "./Runner";
import { Server } from ".";

export default interface Run {
    runID: string;
    runnerID: Runner['runnerID'];
		serverID: Server['serverID'];
    rulesetID: Ruleset['rulesetID'];
		publishDate: Date;
		runTime: number;
		videoURL: string;
		verifiedBy: Runner['runnerID'];
    values: ColumnValue[];
}