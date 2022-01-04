# GraphQL Dataloaders for NestJS

[![NPM Version](https://img.shields.io/npm/v/@tracworx/nestjs-dataloader.svg)](https://www.npmjs.com/package/@tracworx/nestjs-dataloader)
[![Package License](https://img.shields.io/npm/l/@tracworx/nestjs-dataloader.svg)](https://www.npmjs.com/package/@tracworx/nestjs-dataloader)
[![NPM Downloads](https://img.shields.io/npm/dm/@tracworx/nestjs-dataloader.svg)](https://www.npmjs.com/package/@tracworx/nestjs-dataloader)
[![Lint Code Base](https://github.com/tracworx/nestjs-dataloader/actions/workflows/super-linter.yml/badge.svg)](https://github.com/tracworx/nestjs-dataloader/actions/workflows/super-linter.yml)
[![Node.js CI](https://github.com/tracworx/nestjs-dataloader/actions/workflows/ci.yml/badge.svg)](https://github.com/tracworx/nestjs-dataloader/actions/workflows/ci.yml)
[![Node.js Package](https://github.com/tracworx/nestjs-dataloader/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/tracworx/nestjs-dataloader/actions/workflows/npm-publish.yml)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/tracworx/nestjs-dataloader)](https://codeclimate.com/github/tracworx/nestjs-dataloader/maintainability)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/tracworx/nestjs-dataloader)](https://codeclimate.com/github/tracworx/nestjs-dataloader/test_coverage)
[![Twitter](https://img.shields.io/twitter/follow/realEoinOBrien.svg?style=social&label=Follow)](https://twitter.com/realEoinOBrien)

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
  createDataloader(ctx: GqlExecutionContext) {
    // Fetch request-scoped context data if needed
    const user = ctx.getContext().req.user;
    // Replace this with your actual dataloader implementation
    return new DataLoader<string, Item>(async (ids) => getItemsWithIds(user, ids));
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
