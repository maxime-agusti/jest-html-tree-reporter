import { TestReport } from './test-report';
import { CompositeTestReport } from './composite-test-report';
import { LeafTestReport } from './leaf-test-report';

export class TestReportFactory {
    protected results: jest.AggregatedResult;

    constructor(results: jest.AggregatedResult) {
        this.results = results;
    }

    create(): TestReport {
        const mainReport = new CompositeTestReport('Test report'); // TODO

        for (const testFileResult of this.results.testResults) {
            const testFileReport = new CompositeTestReport(testFileResult.testFilePath);

            for (const testResult of testFileResult.testResults) {
                const testReport = new LeafTestReport(testResult.title, testResult.status);

                testFileReport.addChild(testReport, testResult.ancestorTitles);
            }

            mainReport.addChild(testFileReport);
        }

        return mainReport;
    }
}
