import { TestReport } from './test-report';
import { TestStatus } from './types';

export class CompositeTestReport extends TestReport {
    protected children: TestReport[];

    constructor(name: string) {
        super(name);

        this.children = [];
    }

    getStatus(): TestStatus {
        let status: TestStatus = 'passed';

        for (const child of this.getChildren()) {
            switch (child.getStatus()) {
                case 'failed':
                    return 'failed';
                case 'pending':
                    status = 'pending';
                    break;
                // TODO : implement 'skip'
            }
        }

        return status;
    }

    getNumberOfTests(status?: TestStatus): number {
        return this.getChildren().reduce((prev, curr) => prev + curr.getNumberOfTests(status), 0);
    }

    getChildren(): TestReport[] {
        return this.children;
    }

    hasChildren(): boolean {
        return Boolean(this.getChildren().length);
    }

    getChildByName(name: string): TestReport {
        return this.getChildren().find(c => c.getName() === name);
    }

    addChild(testReport: TestReport, ancestorNames: string[] = []): void {
        if (ancestorNames.length > 0) {
            const [name, ...remainingAncerstorNames] = ancestorNames;
            let child = this.getChildByName(name) as CompositeTestReport;

            if (!child) {
                child = new CompositeTestReport(name);
                this.addChild(child);
            }

            child.addChild(testReport, remainingAncerstorNames);
        } else {
            this.children.push(testReport);
        }
    }
}
