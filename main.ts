import { Plugin, WorkspaceLeaf, Notice } from "obsidian";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Header,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { ShunnSidebar } from "./shunn-sidebar";
import { ShunnPluginSettings, DEFAULT_SETTINGS } from "./settings";


export default class ShunnExportPlugin extends Plugin {
  settings: ShunnPluginSettings;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()) as ShunnPluginSettings;

    this.registerView("shunn-sidebar", (leaf: WorkspaceLeaf) =>
      new ShunnSidebar(leaf, this)
    );

    this.addRibbonIcon("book-open-text", "Shunn Export", () => {
      void this.activateView();
    });

    this.addCommand({
      id: "open",
      name: "Open",
      callback: () => { void this.activateView(); },
    });
  }

  async savePluginSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const leaf = this.app.workspace.getRightLeaf(false);
    if (!leaf) return;
    await leaf.setViewState({ type: "shunn-sidebar", active: true });
    void this.app.workspace.revealLeaf(leaf);
  }

  async exportCurrentFile() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice("No active file open!");
      return;
    }

    const content = await this.app.vault.read(activeFile);

    let cleanedContent = content.trim();

    if (cleanedContent.startsWith("---")) {
      const end = cleanedContent.indexOf("\n---", 3);
      if (end !== -1) {
        cleanedContent = cleanedContent.slice(end + 4);
      }
    }

    const lines: string[] = cleanedContent
      .split(/\n{2,}/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    const wordCount = lines.join(" ").split(/\s+/).length;
    const roundedWordCount = Math.round(wordCount / 100) * 100;

    let firstBlock = true;

    const storyParagraphs = lines
      .flatMap((line: string): (Paragraph | null)[] => {
        line = line.replace(/--/g, "—");
        const trimmed = line.trim();

        if (/^#{1,6}\s+/.test(trimmed)) {
          const text = trimmed.replace(/^#+\s+/, "");

          const headingPara = new Paragraph({
            alignment: "center",
            spacing: { line: 480 },
            children: [
              new TextRun({
                text,
                font: this.settings.font,
                size: 24,
                bold: true,
              }),
            ],
          });

          if (firstBlock) {
            firstBlock = false;
            return [headingPara];
          } else {
            return [
              new Paragraph({
                alignment: "center",
                spacing: { line: 480 },
                children: [
                  new TextRun({ text: "#", font: this.settings.font, size: 24 }),
                ],
              }),
              headingPara,
            ];
          }
        }

        if (/^(#|# # #|\* \* \*|---|\*\*\*)$/.test(trimmed)) {
          if (firstBlock) return [];
          firstBlock = false;
          return [
            new Paragraph({
              alignment: "center",
              spacing: { line: 480 },
              children: [
                new TextRun({ text: "#", font: this.settings.font, size: 24 }),
              ],
            }),
          ];
        }

        firstBlock = false;

        const children: TextRun[] = [];
        const regex = /(\*[^*]+\*|_[^_]+_)/g;
        let lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            children.push(new TextRun({
              text: line.slice(lastIndex, match.index),
              font: this.settings.font,
              size: 24,
            }));
          }

          children.push(new TextRun({
            text: match[0].slice(1, -1),
            font: this.settings.font,
            size: 24,
            italics: !this.settings.underlineItalics,
            underline: this.settings.underlineItalics ? {} : undefined,
          }));

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < line.length) {
          children.push(new TextRun({
            text: line.slice(lastIndex),
            font: this.settings.font,
            size: 24,
          }));
        }

        return [
          new Paragraph({
            alignment: "left",
            spacing: { line: 480 },
            indent: { firstLine: 720 },
            children,
          }),
        ];
      })
      .filter((p): p is Paragraph => p !== null);

    const addressCell = this.settings.showAddress
      ? new TableCell({
          children: [
            new Paragraph({
              alignment: "left",
              children: [
                new TextRun({ text: this.settings.author, font: this.settings.font, size: 24 }),
                new TextRun({ break: 1 }),
                new TextRun({ text: this.settings.addressLine1, font: this.settings.font, size: 24 }),
                new TextRun({ break: 1 }),
                new TextRun({ text: this.settings.addressLine2, font: this.settings.font, size: 24 }),
                new TextRun({ break: 1 }),
                new TextRun({ text: this.settings.phoneNumber, font: this.settings.font, size: 24 }),
                new TextRun({ break: 1 }),
                new TextRun({ text: this.settings.email, font: this.settings.font, size: 24 }),
              ],
            }),
          ],
          borders: {
            top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
            bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
            left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
            right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
          },
        })
      : new TableCell({
          children: [],
          borders: {
            top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
            bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
            left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
            right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
          },
        });

    const headerFirst = new Header({
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                addressCell,
                new TableCell({
                  children: [
                    new Paragraph({
                      alignment: "right",
                      children: [
                        new TextRun({
                          text: `about ${roundedWordCount} words`,
                          font: this.settings.font,
                          size: 24,
                        }),
                      ],
                    }),
                  ],
                  borders: {
                    top: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                    bottom: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                    left: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                    right: { size: 0, color: "FFFFFF", style: BorderStyle.NONE },
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    });

    const surname = this.settings.author?.trim().split(" ").slice(-1)[0] || "AUTHOR";
    const storyTitle = this.settings.abbreviateTitle && this.settings.headerAbbreviation?.trim()
      ? this.settings.headerAbbreviation.trim()
      : this.settings.title?.trim() || "TITLE";

    const headerDefault = new Header({
      children: [
        new Paragraph({
          alignment: "right",
          children: [
            new TextRun({
              text: this.settings.anonymous
                ? `${storyTitle} / `
                : `${surname} / ${storyTitle} / `,
              font: this.settings.font,
              size: 24,
            }),
            new TextRun({
              children: [PageNumber.CURRENT],
              font: this.settings.font,
              size: 24,
            }),
          ],
        }),
      ],
    });

    const titlePage = [
      ...Array.from({ length: 12 }, () =>
        new Paragraph({ text: "", spacing: { line: 480 } })
      ),
      new Paragraph({
        alignment: "center",
        spacing: { line: 480 },
        children: [
          new TextRun({
            text: this.settings.title,
            font: this.settings.font,
            size: 24,
            bold: true,
          }),
        ],
      }),
    ];

    if (!this.settings.anonymous) {
      titlePage.push(
        new Paragraph({
          alignment: "center",
          spacing: { line: 480 },
          children: [
            new TextRun({
              text: "by " + this.settings.author,
              font: this.settings.font,
              size: 24,
            }),
          ],
        })
      );
    }

    titlePage.push(
      new Paragraph({
        text: "",
        spacing: { line: this.settings.anonymous ? 480 : 960 },
      })
    );

    const doc = new Document({
      sections: [
        {
          properties: {
            titlePage: true,
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          headers: {
            first: headerFirst,
            default: headerDefault,
          },
          children: [...titlePage, ...storyParagraphs],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.body.createEl("a", {
      attr: { href: url, download: `${this.settings.title || "story"}.docx` },
    });
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    new Notice("Exporting!");
  }
}
