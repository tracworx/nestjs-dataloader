# GraphQL Dataloaders for NestJS

[circleci-image]: https://img.shields.io/circleci/build/github/tracworx/nestjs-dataloader/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/tracworx/nestjs-dataloader

<p align="center">
  <a href="https://www.npmjs.com/~eoin-obrien" target="_blank"><img src="https://img.shields.io/npm/v/@tracworx/nestjs-dataloader.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~eoin-obrien" target="_blank"><img src="https://img.shields.io/npm/l/@tracworx/nestjs-dataloader.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~eoin-obrien" target="_blank"><img src="https://img.shields.io/npm/dm/@tracworx/nestjs-dataloader.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/tracworx/nestjs-dataloader/actions/workflows/ci.yml" target="_blank"><img src="https://github.com/tracworx/nestjs-dataloader/actions/workflows/ci.yml/badge.svg" alt="Node.js CI" /></a>
  <a href="https://github.com/tracworx/nestjs-dataloader/actions/workflows/npm-publish.yml" target="_blank"><img src="https://github.com/tracworx/nestjs-dataloader/actions/workflows/npm-publish.yml/badge.svg" alt="Node.js Package" /></a>
  <a href="https://codeclimate.com/github/tracworx/nestjs-dataloader/maintainability"><img src="https://api.codeclimate.com/v1/badges/27476749d468e511ecdd/maintainability" /></a>
  <a href="https://codeclimate.com/github/tracworx/nestjs-dataloader/test_coverage"><img src="https://api.codeclimate.com/v1/badges/27476749d468e511ecdd/test_coverage" /></a>
  <a href="https://twitter.com/realEoinOBrien" target="_blank"><img src="https://img.shields.io/twitter/follow/realEoinOBrien.svg?style=social&label=Follow"></a>
</p>

## Description

Quick and easy GraphQL [dataloaders](https://github.com/graphql/dataloader) for NestJS.

## Installation

```bash
$ npm install @tracworx/nestjs-dataloader
```

## Usage

Import the `DataloaderModule` in your root module.

```typescript
import { Module } from '@nestjs/common';
import { DataloaderModule } from '@tracworx/nestjs-dataloader';
import { ItemResolver } from './item.resolver';
import { ItemLoader } from './item.loader';

@Module({
  imports: [DataloaderModule],
  providers: [ItemResolver, ItemLoader],
})
export class AppModule {}
```

Decorate dataloader factory classes with `@DataloaderProvider()` to automatically provide them to the GraphQL context object for each request.

```typescript
import DataLoader from 'dataloader';
import { DataloaderProvider } from '@tracworx/nestjs-dataloader';

@DataloaderProvider()
class ItemLoader {
  createDataloader() {
    // Replace this with your actual dataloader implementation
    return new DataLoader<string, Item>(async (ids) => getItemsWithIds(ids));
  }
}
```

Use `@Loader(...)` to inject a dataloader instance into your resolver methods.

```typescript
import DataLoader from 'dataloader';
import { Loader } from '@tracworx/nestjs-dataloader';
import { ItemLoader } from './item.loader';

@Resolver()
class ItemResolver {
  @Query(() => Item, { name: 'item' })
  getItem(@Args('id') id: string, @Loader(ItemLoader) itemLoader) {
    return itemLoader.load(id);
  }
}
```

And that's it. Happy coding!

## Development

```bash
# build
$ npm run build

# format with prettier
$ npm run format

# lint with eslint
$ npm run lint
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Eoin O'Brien](https://github.com/eoin-obrien)
- Website - [https://tracworx.ai](https://tracworx.ai/)
- Twitter - [@realEoinOBrien](https://twitter.com/realEoinOBrien)

## License

`@tracworx/nestjs-dataloader` is [MIT licensed](LICENSE).
