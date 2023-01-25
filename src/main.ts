import {
    Plugin,
    Vault,
    Workspace,
    WorkspaceLeaf, 
    addIcon,
  } from 'obsidian';
import MindmapView from './mindmap-view';
import { MM_VIEW_TYPE } from './constants';
import { MindMapSettings } from './settings';
import { MindMapSettingsTab } from './settings-tab';

  
  export default class MindMap extends Plugin {
    vault: Vault;
    workspace: Workspace;
    mindmapView: MindmapView;
    settings: MindMapSettings;
    
    async onload() {
      console.log("Loading Mind Map plugin");
      this.vault = this.app.vault;
      this.workspace = this.app.workspace;
      this.settings = Object.assign({
        splitDirection: 'Horizontal',
        nodeMinHeight: 16,
        lineHeight: '1em',
        spacingVertical: 5,
        spacingHorizontal: 80,
        paddingX: 8
    }, await this.loadData());

      this.registerView(
        MM_VIEW_TYPE,
        (leaf: WorkspaceLeaf) =>
          (this.mindmapView = new MindmapView(this.settings, leaf, {path:this.activeLeafPath(this.workspace), basename: this.activeLeafName(this.workspace)}))
      );
      
      this.addCommand({
        id: 'app:markmap-preview',
        name: 'Preview the current note as a Mind Map',
        callback: () => this.markMapPreview(),
        hotkeys: []
      });

      this.addSettingTab(new MindMapSettingsTab(this.app, this));

      addIcon("mindmap", `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M0 0H24V24H0z" fill="none"/><path d="M18 3c1.657 0 3 1.343 3 3s-1.343 3-3 3h-3c-1.306 0-2.417-.834-2.829-2H11c-1.1 0-2 .9-2 2v.171c1.166.412 2 1.523 2 2.829 0 1.306-.834 2.417-2 2.829V15c0 1.1.9 2 2 2h1.17c.412-1.165 1.524-2 2.83-2h3c1.657 0 3 1.343 3 3s-1.343 3-3 3h-3c-1.306 0-2.417-.834-2.829-2H11c-2.21 0-4-1.79-4-4H5c-1.657 0-3-1.343-3-3s1.343-3 3-3h2c0-2.21 1.79-4 4-4h1.17c.412-1.165 1.524-2 2.83-2h3zm0 14h-3c-.552 0-1 .448-1 1s.448 1 1 1h3c.552 0 1-.448 1-1s-.448-1-1-1zM8 11H5c-.552 0-1 .448-1 1s.448 1 1 1h3c.552 0 1-.448 1-1s-.448-1-1-1zm10-6h-3c-.552 0-1 .448-1 1s.448 1 1 1h3c.552 0 1-.448 1-1s-.448-1-1-1z"/></g></svg>`)
      this.addRibbonIcon("mindmap", "Preview the current note as a Mind Map", () => this.markMapPreview());

    }

    markMapPreview() {
      const fileInfo = {path: this.activeLeafPath(this.workspace), basename: this.activeLeafName(this.workspace)};
      this.initPreview(fileInfo);
    }

    async initPreview(fileInfo: any) {
      if (this.app.workspace.getLeavesOfType(MM_VIEW_TYPE).length > 0) {
        return;
      }
      const preview = this.app.workspace.splitActiveLeaf(this.settings.splitDirection);
      const mmPreview = new MindmapView(this.settings, preview, fileInfo);
      preview.open(mmPreview);
    }
      
    onunload() {
      console.log("Unloading Mind Map plugin");
    }

    activeLeafPath(workspace: Workspace) {
      return workspace.activeLeaf?.view.getState().file;
    }

    activeLeafName(workspace: Workspace) {
      return workspace.activeLeaf?.getDisplayText();
    }



}