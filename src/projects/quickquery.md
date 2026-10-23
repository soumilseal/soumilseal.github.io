---
layout: layouts/project.njk
id: quickquery
title: "QuickQuery: WebAssembly SQL Query Explorer"
description: "Browser-based interactive relational database playground compiling SQLite to WebAssembly with visual query execution plan diagrams."
category: "Developer Tools"
date: 2026-03-05
order: 6
featured: false
image: "/assets/images/projects/quickquery.webp"
tags:
  - JavaScript
  - WebAssembly
  - SQLite
  - Canvas
  - Tailwind CSS
github: "https://github.com/soumilseal/quickquery"
demo: "https://quickquery.soumilseal.dev"
highlights:
  - "Runs 100% client-side in the browser via SQLite WebAssembly"
  - "Interactive SVG visual graph rendering query explain plan costs"
  - "Exportable CSV/JSON result tables and shareable query URLs"
stats:
  - label: "Runtime"
    value: "100% WebAssembly"
  - label: "Client Latency"
    value: "Zero Server Hop"
  - label: "Data Privacy"
    value: "In-Browser Local"
  - label: "Visual Engine"
    value: "Interactive SVG"
gallery:
  - image: "/assets/images/projects/quickquery.webp"
    caption: "QuickQuery In-Browser SQLite Engine & Visual Query Execution Graph"
---

## Overview

**QuickQuery** is a client-side SQL playground designed to teach and explore relational query optimization without requiring local database servers or cloud databases. By compiling SQLite to **WebAssembly (WASM)**, users can execute complex joins, indexing strategies, and table migrations entirely within the browser.

---

## Core Capabilities

- **Zero-Latency In-Memory Database**: Compiles SQLite 3 to WebAssembly using Emscripten, executing SQL statements directly against an in-browser virtual memory filesystem.
- **Visual Explain Query Plan**: Automatically inspects `EXPLAIN QUERY PLAN` output and generates an interactive directed acyclic graph (DAG) illustrating scan types (Full Table Scan vs. Index Scan), loop counts, and estimated cost metrics.
- **Zero Server Footprint**: User data remains strictly local in the browser memory sandbox, guaranteeing privacy for sensitive test payloads.
