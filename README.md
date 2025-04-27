# Nectar: Knowledge Management Desktop App

Nectar is a cross-platform desktop application for advanced note-taking, knowledge management, and personal knowledge graphing. Built as part of a diploma thesis, it leverages modern web technologies (React, TypeScript, Vite) and the Tauri framework (Rust backend) to deliver a fast, secure, and extensible user experience.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [License](#license)

---

## Project Overview
Nectar is designed to help users manage notes, documents, and their interconnections in a offline, privacy-respecting environment. It supports multiple workspaces ("hives"), a powerful rich text editor, keyboard shortcuts, and a visual graph for exploring relationships between notes. The project demonstrates advanced desktop app development and knowledge management concepts for academic and professional use.

## Features
- **Multi-hive (Workspace) Management**: Organize notes into separate, isolated workspaces.
- **Rich Editor**: Markdown-based editor with support for tables, math (KaTeX), images, code blocks, and more (powered by Tiptap).
- **File Explorer**: Sidebar for browsing, creating, renaming, and deleting notes and folders.
- **Knowledge Graph View**: Visualize and explore relationships between notes as a graph. Find shortest paths between notes.
- **Keyboard Shortcuts**: Highly customizable shortcuts for all major actions, with collision detection and reset options.
- **Settings**: Configure appearance (themes), shortcuts, and other preferences.
- **Local Storage**: All data is stored locally for privacy and performance. Uses SQLite and file system APIs via Tauri plugins.
- **Cross-platform**: Runs on Windows, macOS, and Linux.

## Architecture
- **Frontend**: React 19, TypeScript, Vite, Zustand (state management), Tiptap (editor), TailwindCSS (UI), Radix UI (components).
- **Backend**: Tauri (Rust), using plugins for file system, SQLite, and secure storage.
- **Graph Visualization**: `react-force-graph-2d` for interactive knowledge graphs.
- **Internationalization**: `react-i18next` for multi-language support.

### Directory Structure (Key Parts)
- `src/app/` — Main app entry and providers
- `src/features/` — Main features: editor, graph, settings, layout, homebase (hive management)
- `src/components/` — Reusable UI components
- `src-tauri/` — Tauri (Rust) backend, configuration, and plugins

## Installation & Setup
### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Rust](https://www.rust-lang.org/tools/install) (for Tauri backend)

### Install Dependencies
```bash
pnpm install
```

### Development Mode
Runs the app with hot reload for both frontend and backend:
```bash
pnpm tauri dev
```

### Build for Production
Builds the frontend and packages the Tauri app:
```bash
pnpm tauri build
```

## Usage Guide
### Workspaces (Hives)
- On first launch, create a new hive (workspace) or select an existing one.
- Each hive is an isolated collection of notes and folders.

### Editor & File Explorer
- Use the sidebar to create, rename, or delete notes and folders.
- The main editor supports markdown, tables, math, images, and more.
- Notes can reference each other, forming a knowledge graph.

### Knowledge Graph
- Access the graph view to visualize relationships between notes.
- Use the "Find Shortest Path" tool to discover connections between notes.

### Keyboard Shortcuts
- Access settings to view and customize all keyboard shortcuts.
- Shortcuts can be reset to defaults or individually changed.

### Settings
- Change appearance (light/dark theme), manage shortcuts, and other preferences.

## Configuration
- **Tauri**: See `src-tauri/tauri.conf.json` for app window, security, and plugin settings.
- **Rust Backend**: See `src-tauri/Cargo.toml` for dependencies and plugin configuration.
- **Frontend**: See `package.json` for JS/TS dependencies.

*This project was developed as part of a diploma thesis to demonstrate advanced desktop application development and graph theory practical usage.*
