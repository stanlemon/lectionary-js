# Lectionary Calculator & Calendar

This is a library for calculating weeks of the Western Christian church calendar. This Christian calendar is often referred to as the liturgical year and each Sunday in it has an associated set readings called pericopes. These pericopes and prayers that go with them are often called propers and together make up the lectionary.

This library is a derivative of [sanctus.org](https://sanctus.org) a website that I started back in 2004 with some of my college classmates while studying _Theology & Biblical Languages_. The Lutheran Church was having a liturgical renaissance at that moment as one of the major Lutheran church bodies in North America was creating a new hymnal. Part of that renaissance involved revisiting what some call the _historical lectionary_, a set of Epistle and Gospel lessons that have been used throughout antiquity. That hymnal, the _Lutheran Service Book_ (hereafter LSB), gave new life to the historical readings in the form of its one year lectionary. It also introduced a brand new daily lectionary. Prior to the publishing of the LSB all we had were a set of Microsoft Word docs prepared by those compiling the hymnal. As such [sanctus.org](https://sanctus.org) started as a simple way to facilitate our dorm devotions.

Many years after graduating from college I am still amazed and grateful at the traffic that [sanctus.org](https://sanctus.org) receives. I have open sourced the calculator used by the website previously written in PHP, but never any data, calendar building or rendering code. This repository aims to open source as much of the website as I can, both to share knowledge and to enable others to do with the codebase as they please.

_All of the code in this repository is available free under the [MIT](LICENSE) license. Data belongs to the church at large over the ages and the many faithful who have curated it throughout antiquity._

## Getting Started

There are two pieces to this library, first is the calculator and second is a [React](http://reactjs.org) app that serves as the latest generation of [sanctus.org](https://sanctus.org).

You can see the app in action at: 

Install dependencies:

```shell
npm install
```

Run tests:

```shell
npm run test
```

Run the web app:

```shell
npm run start
```

## Contributing

Almost all of the data supplied here has been entered by hand over the years. If you spot an error, let me know, or better yet submit a pull request with the fix to one of the data files.

This repository is **not** intended to include an exhaustive set of Christian lectionaries. If you're interested in using this codebase with a different tradition's propers I think that's great, but upstream contributions will not be merged in. This codebase has been designed so that you can use it as a library in your own project, and you can always fork it too.

Any functional change of improvement to the library or application code **must** include a thorough descript, be _linted_ and have corresponding tests.
