# Letterboxd/Plex sync

Quick JavaScript utility for syncing your Movie library in Plex with your Letterboxd "Watched" status

## Usage

```sh
$ git clone https://github.com/codewithkristian/letterboxd-plex-watched-sync
$ cd letterboxd-plex-watched-sync
$ npm install
$ cp .env.example .env
```

## Configuration

You'll need the actual IP address or hostname that your Plex server is running on (_not_ a link to `app.plex.tv` or something similar). Plug that in, along with your Plex username and password, to `.env`.

Most Plex libraries have a "Movies" library that is named... "Movies". If yours is named something different, you'll need to change `index.js`, specifically the `MOVIE_LIBRARY_NAME` variable.

Finally, you'll need a CSV of your watched films on Letterboxd. Currently, Letterboxd's API is invite-only, so this is kind of a crappy solution that works fine for our use-case. You can export it on your [Data](https://letterboxd.com/settings/data) page.

## Sync

Syncing should only take a few seconds, and can be done with `npm start`. Any films that are being updated with "Watched" will be output in the console:

```sh
$ npm start
✅ 2 Fast 2 Furious
✅ 10 Cloverfield Lane
✅ 12 Angry Men
✅ 300
✅ 1408
// ...
```

## Troubleshooting

This repo is super rough - it may screw up your "Watched" status in Plex. Sorry! It also is somewhat wasteful in terms of _how_ it updates film "Watched" status: it will always make a request (doesn't check for existing watched status) and has no way of aggregating the requests it makes to your server. In large libraries, you may want to run it overnight so that it doesn't overload your server - your mileage may vary!
