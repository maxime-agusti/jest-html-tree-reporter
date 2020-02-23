import { TestReport } from './test-report';
import { TestStatus } from './types';

export class LeafTestReport extends TestReport {
    protected status: TestStatus;

    constructor(name: string, status: TestStatus) {
        super(name);

        this.status = status;
    }

    getStatus(): TestStatus {
        return this.status;
    }

    getNumberOfTests(status?: TestStatus): number {
        if (!status || status === this.getStatus()) {
            return 1;
        }

        return 0;
    }

    getChildren(): TestReport[] {
        return [];
    }

    hasChildren(): boolean {
        return false;
    }
}
