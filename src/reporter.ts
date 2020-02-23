import { TestReportFactory } from './test-report-factory';
import { HtmlReportGenerator } from './html-report-generator';

export class Reporter implements jest.Reporter {
    protected results: jest.AggregatedResult;

    setResults(results: jest.AggregatedResult): void {
        this.results = results;
    }

    getResults(): jest.AggregatedResult {
        return this.results;
    }

    onRunComplete(contexts: Set<jest.Context>, results: jest.AggregatedResult): jest.Maybe<Promise<void>> {
        this.setResults(results);

        this.generate();
    }

    generate() {
        const testReportFactory = new TestReportFactory(this.getResults());
        const testReport = testReportFactory.create();

        const htmlReportGenerator = new HtmlReportGenerator(testReport);
        htmlReportGenerator.generate();
    }
}
