---
layout: layouts/project.njk
id: microdeploy
title: "MicroDeploy: Containerized Deployment Pipeline"
description: "An automated CI/CD automation pipeline orchestrating blue-green container deployments, health checking, and automatic rollback triggers."
category: "Cloud & Infrastructure"
date: 2026-05-18
order: 4
featured: false
image: "/assets/images/projects/microdeploy.webp"
tags:
  - Python
  - Docker
  - GitHub Actions
  - AWS
  - Bash
github: "https://github.com/soumilseal/microdeploy"
demo: "https://github.com/soumilseal/microdeploy#readme"
highlights:
  - "Zero-downtime blue-green container cutover with reverse proxy reload"
  - "Automated smoke test suite validating HTTP endpoints before traffic routing"
  - "Automated rollback triggered if 5xx error rate exceeds 1% threshold"
stats:
  - label: "Deployment Strategy"
    value: "Blue-Green"
  - label: "Downtime"
    value: "0.0 seconds"
  - label: "Rollback Trigger"
    value: "< 1.5s auto"
  - label: "Container Engine"
    value: "Docker Swarm"
gallery:
  - image: "/assets/images/projects/microdeploy.webp"
    caption: "MicroDeploy Continuous Delivery & Blue-Green Traffic Switch Flow"
---

## Overview

**MicroDeploy** is an infrastructure automation pipeline engineered to bridge the gap between complex Kubernetes setups and basic single-server Docker hosting. It implements a fully automated **blue-green deployment workflow** with integrated pre-traffic smoke testing, live HTTP reverse-proxy cutovers, and instant autonomous rollbacks upon detected anomalies.

---

## Technical Pipeline Mechanics

1. **Staged Provisioning**: A new container release (Green) is spun up alongside the active production release (Blue) on isolated internal network bridges.
2. **Synthetic Health Validation**: MicroDeploy executes an automated suite of end-to-end integration probes against Green's private endpoints.
3. **Atomic NGINX Upstream Swap**: Upon successful verification, NGINX configuration reloads in under 50ms with zero dropped connections.
4. **Automated Rollback Safeguard**: Telemetry probes monitor 5xx HTTP response codes during the initial 120-second canary window; if errors exceed 1%, traffic is autonomously rerouted back to Blue.
