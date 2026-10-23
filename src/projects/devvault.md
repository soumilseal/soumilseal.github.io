---
layout: layouts/project.njk
id: devvault
title: "DevVault: Offline-First Developer Snippet CLI"
description: "Terminal-based knowledge vault and code snippet manager featuring local AES-256 GCM encryption, fuzzy search, and syntax highlighting."
category: "Developer Tools"
date: 2026-07-22
order: 2
featured: true
image: "/assets/images/projects/devvault.webp"
tags:
  - TypeScript
  - Node.js
  - SQLite
  - CLI
  - Cryptography
github: "https://github.com/soumilseal/devvault"
demo: "https://github.com/soumilseal/devvault#readme"
highlights:
  - "Zero-latency fuzzy search powered by SQLite FTS5"
  - "Client-side encrypted vault keys with Argon2id password hashing"
  - "Seamless terminal clipboard copy and multi-language syntax formatting"
stats:
  - label: "Encryption"
    value: "AES-256-GCM"
  - label: "Key Derivation"
    value: "Argon2id"
  - label: "Search Engine"
    value: "SQLite FTS5"
  - label: "Search Latency"
    value: "< 1.2 ms"
gallery:
  - image: "/assets/images/projects/devvault.webp"
    caption: "DevVault Terminal Interface & Multi-Language Syntax Rendering"
  - image: "/assets/images/projects/devvault-cli.webp"
    caption: "Fuzzy Find Execution & Instant Authenticated Clipboard Copy"
---

## Overview

**DevVault** is a terminal-based snippet manager and private developer notebook built for engineers who work across multiple workstations and require instant, zero-latency access to their curated library of commands, algorithms, and configuration scripts without relying on third-party cloud servers.

Engineered with an offline-first philosophy, all data is stored inside a local SQLite database with cryptographic protection powered by **AES-256-GCM** authenticated encryption and **Argon2id** password-based key derivation.

---

## Architectural Breakdown

```
  CLI Commands (add, search, copy, sync)
                  │
                  ▼
  ┌────────────────────────────────────────────────────────┐
  │                 Security & Crypto Layer                │
  │     Argon2id Master Passphrase -> 256-bit Key          │
  │     AES-256-GCM Authenticated Encryption/Decryption   │
  └───────────────────────────┬────────────────────────────┘
                              │
                              ▼
  ┌────────────────────────────────────────────────────────┐
  │                 Local SQLite Engine                    │
  │  ┌────────────────────────┐  ┌───────────────────────┐ │
  │  │ FTS5 Full-Text Index   │  │ Encrypted Payload Blob│ │
  │  │ (Tags, Language, Title)│  │ (Ciphertext + IV + Tag)│ │
  │  └────────────────────────┘  └───────────────────────┘ │
  └────────────────────────────────────────────────────────┘
```

### Cryptographic Security Model
DevVault guarantees that secrets, tokens, or proprietary algorithms stored in your local repository cannot be read if your laptop or disk is stolen:
1. **Key Derivation**: When unlocking DevVault, your master passphrase is fed through Argon2id (memory cost: 64MB, iterations: 3, parallelism: 4) to generate an ephemeral 256-bit AES key.
2. **Authenticated Ciphertext**: Snippets are encrypted with AES-256 in Galois/Counter Mode (GCM). An initialization vector (IV) is uniquely generated per snippet alongside a 128-bit authentication tag to prevent bit-flipping attacks.

### Instant Fuzzy Search with SQLite FTS5
By compiling SQLite with the FTS5 full-text search extension, DevVault indexes titles, descriptions, and language tags into a BM25 ranking tree. Queries across thousands of snippets resolve in under 2 milliseconds.

---

## Core Capabilities

- **Interactive Fuzzy Finder**: Terminal interactive search using arrow keys or Vim bindings (`j`/`k`).
- **Direct Clipboard Integration**: Select a snippet and press `Ctrl+C` to copy directly into your system clipboard with automatic terminal notification.
- **Multi-Language Syntax Highlighting**: Colorized ANSI syntax highlighting powered by PrismJS for over 40 programming and scripting languages.
