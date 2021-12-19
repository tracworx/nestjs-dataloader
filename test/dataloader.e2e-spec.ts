import { INestApplication } from '@nestjs/common';
import { Args, Field, GraphQLModule, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import DataLoader from 'dataloader';
import { DataloaderModule, DataloaderProvider, Loader } from '../src';
import request = require('supertest');

const getItemsFromDatabase = jest.fn((ids: readonly string[]): Item[] => {
  return ids.map((key) => new Item(key));
});

@ObjectType()
class Item {
  constructor(id: string) {
    this.id = id;
  }

  @Field()
  id: string;
}

@DataloaderProvider()
class ItemLoader {
  createDataloader() {
    return new DataLoader<string, Item>(async (keys) => getItemsFromDatabase(keys));
  }
}

@Resolver()
class ItemResolver {
  @Query(() => Item, { name: 'item' })
  getItem(@Args('id') id: string, @Loader(ItemLoader) itemLoader: DataLoader<string, Item>) {
    return itemLoader.load(id);
  }
}

describe('DataloaderModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DataloaderModule, GraphQLModule.forRoot({ autoSchemaFile: true })],
      providers: [ItemResolver, ItemLoader],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should automatically integrate with a GraphQL API', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
            item1: item(id: "1") { id }
            item2: item(id: "2") { id }
            item3: item(id: "3") { id }
            item4: item(id: "4") { id }
            item5: item(id: "5") { id }
          }`,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data).toEqual({
          item1: { id: '1' },
          item2: { id: '2' },
          item3: { id: '3' },
          item4: { id: '4' },
          item5: { id: '5' },
        });

        // Dataloader should be invoked exactly once
        expect(getItemsFromDatabase).toHaveBeenCalledTimes(1);
      });
  });
});
