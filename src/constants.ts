/**
 * Namespace for GraphQL context and metadata keys to reduce the likelihood of collision.
 */
export const PACKAGE_NAMESPACE = 'nestjs-dataloader';

/**
 * The GraphQL context object key that stores the dataloader map.
 */
export const GQL_CONTEXT_KEY = `${PACKAGE_NAMESPACE}:dataloaders`;

/**
 * The metadata key that designates a class as a dataloader provider.
 */
export const METADATA_KEY = `${PACKAGE_NAMESPACE}:dataloader-provider`;
