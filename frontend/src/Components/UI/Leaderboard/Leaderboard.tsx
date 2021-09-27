import { Component } from "react";
import { Category, Column, Duration, Run, VOD } from "../../../Models";
import data from "../../../dummy-data.json";
import ColumnConverter from "../../../Utlities/ColumnConverter";
import { Videocam } from "@material-ui/icons";

import "./Leaderboard.css"

export type LeaderboardProps = {
    category: Category;
    runs: Run[];
    sorter?: (a: Run, b: Run) => number;
}

type LeaderboardState = {
    columns: Column[]
}

export default class Leaderboard extends Component<LeaderboardProps, LeaderboardState> {
    constructor(props: LeaderboardProps) {
        super(props);
        this.state = {columns: ((data.columns as unknown[]) as Column[]).filter(column => column.category === this.props.category.id || column.category === null)};
    }

    render() {
        return (
            <table className="leaderboard">
                <thead>
                    <tr style={{textTransform: "capitalize"}}>
                        <th>Rank</th>
                        <th>Runner</th>
                        {this.state.columns.map(column => (
                            <th key={column.id}>{column.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {this.props.runs
                    .filter(run => run.categoryId === this.props.category.id)
                    .sort(this.props.sorter ? this.props.sorter : (run1, run2) => {
                        const a = run1.values.find(value => ColumnConverter.Resolve(this.state.columns, value) instanceof Duration)?.value;
                        const b = run2.values.find(value => ColumnConverter.Resolve(this.state.columns, value) instanceof Duration)?.value;
                        if (a > b) return 1;
                        else if (a === b) return 0;
                        else if (a < b) return -1;
                        else throw new Error("Unable to compare values!");
                    }).map((run, postion) => (
                        <tr key={run.id}>
                            <td>
                                {postion + 1}
                            </td>
                            <td>
                                {run.runner.username + '#' + run.runner.discriminator}
                            </td>
                            {
                                run.values.map(valueColumn => {
                                    return {key: valueColumn.id, value: ColumnConverter.Resolve(this.state.columns, valueColumn)}
                                }).map(converted => {
                                    let display;
                                    if(converted.value instanceof Date) {
                                        const d = converted.value;
                                        display = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
                                    } 
                                    else if (converted.value instanceof VOD) {
                                        display = <a href={converted.value.url} style={{color: "white"}} target="_blank" rel="noreferrer"><Videocam/></a>;
                                    } else {
                                        display = converted.value.toString();
                                    }
                                    return (
                                        <td key={converted.key}>{display}</td>
                                    );
                                })
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}