import { writeFileSync } from 'fs';
import { sync as mkdirp } from 'mkdirp';
import { resolve } from 'path';
import { compileFile } from 'swig-templates';
import { TestReport } from "./test-report";
import { TestStatus } from "./types";

const TEMPLATE_PATH = resolve(__dirname, '../assets/index.html.twig');

interface ChunkItem {
    id: string;
    name: string;
    status: TestStatus;
    hasChildren: boolean;
}

type Chunk = ChunkItem[];

export class HtmlReportGenerator {
    protected testReport: TestReport;
    protected generateIndexHtmlContent: ({ report: TestReport }) => string;

    constructor(testReport: TestReport) {
        this.testReport = testReport;
        this.generateIndexHtmlContent = compileFile(TEMPLATE_PATH);
    }

    generate(): void {
        this.generateIndexHtml();
        this.generateChunks();
    }

    generateIndexHtml(): void {
        mkdirp('report');

        const content = this.generateIndexHtmlContent({ report: this.testReport });
        writeFileSync('report/index.html', content);
    }

    generateChunks(): void {
        mkdirp('report/data');

        this.generateChunk(this.testReport);
    }

    generateChunk(testReport: TestReport): void {
        if (!testReport.hasChildren()) {
            return;
        }

        const chunk = HtmlReportGenerator.testReportToChunk(testReport);

        writeFileSync(`report/data/${testReport.getId()}.json`, JSON.stringify(chunk));

        for (const childTestReport of testReport.getChildren()) {
            this.generateChunk(childTestReport);
        }
    }

    static testReportToChunk(testReport: TestReport): Chunk {
        return testReport.getChildren().map(child => ({
            id: child.getId(),
            name: child.getName(),
            status: child.getStatus(),
            hasChildren: child.hasChildren(),
        }));
    }
}
