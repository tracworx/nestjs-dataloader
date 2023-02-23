import { ExecutionContext } from "@nestjs/common";
import { InstanceToken } from "@nestjs/core/injector/module";
import { GqlExecutionContext } from "@nestjs/graphql";
import DataLoader from "dataloader";
import { GQL_CONTEXT_KEY } from "../src/constants";

export const executionContextMockFactory = (
  context: Record<string, any>,
  info: Record<string, any>,
): ExecutionContext =>
({
  getType: () => 'graphql',
  getHandler: () => 'query',
  getClass: () => 'Test',
  getArgs: () => [{}, {}, context, info],
  getArgByIndex: jest.fn(),
  switchToHttp: () => jest.fn(),
  switchToRpc: () => jest.fn(),
  switchToWs: () => jest.fn(),
} as any);

export const gqlExecutionContextMockFactory = (
  dataloaders?: readonly (readonly [InstanceToken, DataLoader<any, any>])[] | null,
): ExecutionContext => {
  const mockExecutionContext = executionContextMockFactory({}, {})
  const mockGqlExecutionContext = GqlExecutionContext.create(mockExecutionContext);
  if (dataloaders) {
    mockGqlExecutionContext.getContext()[GQL_CONTEXT_KEY] = new Map(dataloaders);
  }
  return mockExecutionContext;
};
