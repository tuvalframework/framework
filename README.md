<!-- markdownlint-disable-next-line -->
<p align="center">
  <a href="http://tuvalframework.com/" rel="noopener" target="_blank"><img width="150" src="https://github.com/tuvalframework/framework/raw/main/logo-194x194.png" alt="Tuval logo"></a>
</p>

<h1 align="center">Tuval Framework</h1>

**Tuval Framework** contains four main library for creating robust applications which are running on the browser.

- [_Core_](https://github.com/tuvalframework/framework/tree/main/core/) is a library that contains the base classes that all programs will need.


[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tuvalframework/framework/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@tuval/core/latest.svg)](https://www.npmjs.com/package/@tuval/core)
[![npm next package](https://img.shields.io/npm/v/@tuval/core/next.svg)](https://www.npmjs.com/package/@tuval/core)
[![npm downloads](https://img.shields.io/npm/dm/@tuval/core.svg)](https://www.npmjs.com/package/@tuval/core)
[![Follow on Twitter](https://img.shields.io/twitter/follow/tuvalframework.svg?label=follow+tuvalframework)](https://twitter.com/tuvalframework)
[![Follow on Youtube](https://img.shields.io/youtube/channel/views/UCIvOMAYBuLllvPIJp0o-opQ?style=social)](https://www.youtube.com/channel/UCIvOMAYBuLllvPIJp0o-opQ)

- **Visit:** The [Home Page](http://tuvalframework.com/) and follow on [Twitter](https://twitter.com/tuvalframework)
- **Discover:** [Tutorials](http://tuvalframework.com), [API Documentation](http://tuvalframework.com)
- **Help:** [StackOverflow](http://stackoverflow.com/questions/tagged/tuvalframework)


## Installation

### Tuval Framework

Tuval Framework is available as an npx package and you can create a development envoriment one command.
Make sure docker is running before you start the installation.

**npm:**

```sh
npx create-tuval
```
You can also install TF libraries separately.

### TF Core

TF Core is available as an [npm package](https://www.npmjs.com/package/@tuval/core).

**npm:**

```sh
npm install @tuval/core
```

### TF CG

TF Core Graphics is available as an [npm package](https://www.npmjs.com/package/@tuval/cg).

**npm:**

```sh
npm install @tuval/cg
```

### TF Graphics

TF Graphics is available as an [npm package](https://www.npmjs.com/package/@tuval/graphics).

**npm:**

```sh
npm install @tuval/graphics
```


### TF Forms

TF Forms is available as an [npm package](https://www.npmjs.com/package/@tuval/forms).

**npm:**

```sh
npm install @tuval/forms
```

## Getting started with Tuval Framework

Here is an example slice of a basic view in Tuval Framework. You can use playground for
create your view.

```ts
// MARK : Main Frame of Form
    VStack({ alignment: cTop })(

        // MARK: Top Bar
        HStack({alignment:cLeading})(
            UIImage(logo).width(50).height(50),
            Text('Procetra').foregroundColor(Color.white).fontSize(20)
            .fontWeight('bold')
        ).background('rgb(208, 63, 64)').height(70),

        // MARK: Filter bar
        HStack().background('#212932').height(60),

        // MARK: Content
        HStack({ alignment: cLeading })(

            // Main Menu
            VStack({ alignment: cTop })(
                ...ForEach(menuModel)((item, index) =>
                    // MARK: Menu item
                    item.title == 'sep' ?
                        VStack().height(1).background(Color.white)
                        :
                        VStack({ spacing: 10 })(
                            Icon(item.icon).size(30),
                            Text(item.title)
                        ).height(70).foregroundColor({ default: Color.white, hover: Color.black })
                            .marginTop('10px')
                            .onClick(() => setSelectedIndex(index))
                            .background({ default: selectedIndex == index ?
                            Color.green : '', hover: '#eee' }).cursor('pointer')
                )

            ).background('#212932').width(80),

            // MARK: Sub menu
            VStack({ alignment: cTop })(
                ...ForEach(menuModel[selectedIndex].subMenu)((item, index) =>
                    // MARK: Menu item
                        VStack({ spacing: 10 })(
                            Icon(item.icon).size(30),
                            Text(item.title)
                        ).height(70).foregroundColor({ default: Color.white, hover: Color.black })
                            .marginTop('10px')
                            .onClick(() => setSelectedIndex(index))
                            .background({  hover: '#eee' }).cursor('pointer')
                )
            ).background('#52565b').width()
                .initial({ width: 0 }).animate({ width: 80 })
                .shadow('inset 24px 0 20px -20px #373b40')
                .visible(Array.isArray(menuModel[selectedIndex].subMenu)),

        )
    )
```
![View is ](https://github.com/tuvalframework/framework/raw/main/screen1.png "TF Playground")

For starter app, you can [visit](https://github.com/tuvalframework/developer) developer repo.


## Questions

For how-to questions that don't involve making changes to the code base, please use [Stack Overflow](https://stackoverflow.com/questions/tagged/tuvalframework) instead of GitHub issues.
Use the "tuvalframework" tag on Stack Overflow to make it easier for the community to find your question.

