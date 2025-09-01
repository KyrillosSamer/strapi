import type { Schema, Struct } from '@strapi/strapi';

export interface ServicesSections extends Struct.ComponentSchema {
  collectionName: 'components_services_sections';
  info: {
    displayName: 'sections';
  };
  attributes: {
    list: Schema.Attribute.JSON;
    text: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'services.sections': ServicesSections;
    }
  }
}
