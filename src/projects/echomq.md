---
layout: layouts/project.njk
id: echomq
title: "EchoMQ: Minimal In-Memory Publish-Subscribe Broker"
description: "A high-throughput in-memory message broker implementing topic subscription, wildcard channel matching, and durable message persistence."
category: "Systems"
date: 2026-04-10
order: 5
featured: false
image: "/assets/images/projects/echomq.webp"
tags:
  - Java
  - TCP Sockets
  - Concurrency
  - Data Structures
github: "https://github.com/soumilseal/echomq"
demo: "https://github.com/soumilseal/echomq#readme"
highlights:
  - "Lock-free ring buffer queue supporting 85,000+ msgs/sec"
  - "Custom binary TCP framing protocol minimizing network overhead"
  - "Trie-based wildcard topic routing supporting multi-tier wildcard channels"
stats:
  - label: "Throughput"
    value: "85k+ msgs/s"
  - label: "Concurrency"
    value: "Lock-Free Ring"
  - label: "Wire Protocol"
    value: "Custom Binary"
  - label: "Routing Index"
    value: "Prefix Trie"
gallery:
  - image: "/assets/images/projects/echomq.webp"
    caption: "EchoMQ Low-Latency TCP Socket Pipeline & Trie Matching Architecture"
---

## Overview

**EchoMQ** is an experimental in-memory publish-subscribe message broker implemented from scratch in Java, designed to explore high-concurrency systems programming, non-blocking I/O architectures, and low-latency network protocols.

---

## Architectural Highlights

- **LMAX-Inspired Disruptor Pattern**: Uses a lock-free circular ring buffer backed by atomic memory barriers (`Unsafe`/`VarHandle`) to achieve multi-producer, multi-consumer message dispatch with zero thread locking.
- **Trie-Based Topic Router**: Implements an optimized Radix Trie allowing multi-segment wildcard topic lookups (e.g., `sensors/+/temperature`) to evaluate in $O(k)$ time where $k$ is the number of path tokens.
- **Binary Wire Protocol**: Custom length-prefixed binary framing protocol that cuts serialisation overhead compared to JSON or XML down to just 8 bytes of protocol header per payload.
