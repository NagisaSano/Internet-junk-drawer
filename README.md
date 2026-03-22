# Internet Junk Drawer

A tiny public corner of the internet for experiments, odd little ideas, and files that did not need to exist.

## What Is This?

This repository has no product roadmap, startup angle, or serious mission.

It is a deliberately random public repo:

- a place to ship weird mini things
- a place to keep internet-shaped leftovers
- a place to make and publish something just because it feels funny

## What Is Inside

Right now this repo contains a small static website that behaves like a mini cabinet of digital curiosities.

It currently has:

- a generator for strange "internet artifacts"
- a local archive shelf that remembers your favorite relics
- an "artifact of the day" that can refresh automatically
- an absurd guestbook powered by GitHub issues
- a visual layout that feels more like an odd poster than a default landing page

Open [index.html](./index.html) in a browser and start spinning the drawer.

## Why It Exists

Because not every repo needs a reason.

## Suggested Repo Names

If you want to rename the GitHub repo before publishing it, these fit the vibe:

- `internet-junk-drawer`
- `public-side-quest`
- `tiny-weird-website`
- `unnecessary-artifacts`

## Repo Vibe

The best version of this repo is probably one that stays a little messy, a little charming, and slightly harder to justify every time it gets updated.

## Automation

The repo now includes two GitHub Actions workflows:

- `.github/workflows/deploy-pages.yml` deploys the site to GitHub Pages
- `.github/workflows/artifact-of-the-day.yml` refreshes the daily artifact once per day

The guestbook works through GitHub issues instead of a custom backend:

- the site opens a prefilled issue for visitors
- the wall fetches recent guestbook entries from the public GitHub API

## Optional Next Moves

- let GitHub Pages publish it as a proper tiny public site
- let strangers add increasingly questionable guestbook notes
- keep the daily artifact weird enough to deserve the automation
- keep adding features that are delightful before they are useful
- keep the README cleaner than the contents

## Structure

- `index.html` - the public page
- `artifact-engine.js` - the shared artifact generator used by the browser and the daily script
- `styles.css` - the visual system and layout
- `script.js` - the artifact generator, guestbook client, and local shelf logic
- `data/artifact-of-the-day.js` - the generated daily artifact payload
- `scripts/update-artifact-of-the-day.cjs` - the script that refreshes the daily artifact data
- `.github/workflows/` - the Pages and daily automation workflows
- `favicon.svg` - the tiny drawer icon
- `LICENSE` - MIT
