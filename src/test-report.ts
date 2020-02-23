import { TestStatus } from "./types";
import * as uuid from 'uuid/v4'; // TODO synthetic import

export abstract class TestReport {
    protected id: string;
    protected name: string;

    constructor(name: string) {
        this.id = uuid();
        this.name = name;
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    abstract getStatus(): TestStatus;
    abstract getNumberOfTests(status?: TestStatus): number;
    abstract getChildren(): TestReport[];
    abstract hasChildren(): boolean;
}
