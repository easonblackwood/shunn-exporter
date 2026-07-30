import { ItemView, WorkspaceLeaf, Setting } from "obsidian";
import type ShunnExportPlugin from "./main";

export class ShunnSidebar extends ItemView {
  plugin: ShunnExportPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: ShunnExportPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return "shunn-sidebar";
  }

  getDisplayText() {
    return "Shunn Export";
  }

  async onOpen() {
    const container = this.containerEl.children[1] as HTMLElement;
    container.empty();

    container.createEl("h2", { text: "Shunn Exporter" });

    new Setting(container)
      .setName("Title")
      .addText(text => text
        .setValue(this.plugin.settings.title)
        .onChange(async val => {
          this.plugin.settings.title = val;
          await this.plugin.savePluginSettings();
        }));

    new Setting(container)
      .setName("Author Name")
      .addText(text => text
        .setValue(this.plugin.settings.author)
        .onChange(async val => {
          this.plugin.settings.author = val;
          await this.plugin.savePluginSettings();
        }));

    new Setting(container)
      .setName("Font")
      .addDropdown(drop => drop
        .addOption("Courier", "Courier")
        .addOption("Courier New", "Courier New")
        .addOption("Times New Roman", "Times New Roman")
        .setValue(this.plugin.settings.font)
        .onChange(async val => {
          this.plugin.settings.font = val;
          await this.plugin.savePluginSettings();
        }));

    new Setting(container)
      .setName("Include Address on Title Page")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.showAddress)
          .onChange(async val => {
            this.plugin.settings.showAddress = val;
            await this.plugin.savePluginSettings();
            this.onOpen();
          }));

    if (this.plugin.settings.showAddress) {
      new Setting(container)
        .setName("Address Line 1")
        .addText(text =>
          text
            .setValue(this.plugin.settings.addressLine1)
            .onChange(async val => {
              this.plugin.settings.addressLine1 = val;
              await this.plugin.savePluginSettings();
            }));

      new Setting(container)
        .setName("Address Line 2")
        .addText(text =>
          text
            .setValue(this.plugin.settings.addressLine2)
            .onChange(async val => {
              this.plugin.settings.addressLine2 = val;
              await this.plugin.savePluginSettings();
            }));

      new Setting(container)
        .setName("Phone Number")
        .addText(text =>
          text
            .setValue(this.plugin.settings.phoneNumber)
            .onChange(async val => {
              this.plugin.settings.phoneNumber = val;
              await this.plugin.savePluginSettings();
            }));

      new Setting(container)
        .setName("Email")
        .addText(text =>
          text
            .setValue(this.plugin.settings.email)
            .onChange(async val => {
              this.plugin.settings.email = val;
              await this.plugin.savePluginSettings();
            }));
    }

    new Setting(container)
      .setName("Abbreviate Header Title")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.abbreviateTitle)
          .onChange(async val => {
            this.plugin.settings.abbreviateTitle = val;
            await this.plugin.savePluginSettings();
            this.onOpen();
          }));

    if (this.plugin.settings.abbreviateTitle) {
      new Setting(container)
        .setName("Header Title")
        .addText(text =>
          text
            .setValue(this.plugin.settings.headerAbbreviation)
            .onChange(async val => {
              this.plugin.settings.headerAbbreviation = val;
              await this.plugin.savePluginSettings();
            }));
    }

    new Setting(container)
      .setName("Show Italics as Underline")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.underlineItalics)
          .onChange(async val => {
            this.plugin.settings.underlineItalics = val;
            await this.plugin.savePluginSettings();
          }));

    new Setting(container)
      .setName("Anonymous Manuscript")
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.anonymous)
          .onChange(async val => {
            this.plugin.settings.anonymous = val;
            await this.plugin.savePluginSettings();
            this.onOpen();
          }));

    new Setting(container)
      .addButton(btn =>
        btn.setButtonText("Export")
           .onClick(() => this.plugin.exportCurrentFile())
      );
  }

  async onClose() {}
}
