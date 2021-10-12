# Lectionary Calculator & Calendar

This is a library for calculating the weeks of the Western Christian church calendar. This Christian calendar is also called the liturgical year.  Each Sunday has a set of appointed readings called pericopes. The lectionary has pericopes as well as prayers, which together are the propers.

This library comes from I first build with friends while at college. It was first built to help my friends and I organize our dorm devotions. When the Lutheran Church Missouri Synod began work on a new hymnal we added it to the site. The hymnal committee put a Microsoft Word doc with the propers online for review.  It included a revision of the one year lectionary and a new daily lectionary.

I am amazed that so many years later people still use the site. I open sourced the calculator used by the website in PHP before. This JavaScript library includes a similar calculator as well as calendar building tooling. It also includes structured data of the various propers. I hope that by open sourcing this library it will enable other to build new tools and applications.

_All of the code in this repository is available free under the [MIT](LICENSE) license. Lectionary data belongs to the church at large throughout time._

## Getting Started

This repository includes the calculator library and a [React](http://reactjs.org) web app.

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

The data in this repository was been entered by hand. If you spot an error, let me know or submit a pull request with the fix.

This repository is **not** intended to be an exhaustive set of Christian lectionaries. If you're interested in using this project with another tradition's lectionary that's great. However, it does not mean I will incorporate that lectionary into this repository. This codebase is reusable so that you can incorporate it in your own project.

Any functional change **must** include a thorough description, be _linted_ and have tests.
