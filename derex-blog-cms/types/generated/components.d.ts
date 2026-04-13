import type { Schema, Struct } from '@strapi/strapi';

export interface BlogCarousel extends Struct.ComponentSchema {
  collectionName: 'components_blog_carousels';
  info: {
    description: 'Carousel media block';
    displayName: 'Carousel';
  };
  attributes: {
    media: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface BlogContent extends Struct.ComponentSchema {
  collectionName: 'components_blog_contents';
  info: {
    description: 'Rich text block';
    displayName: 'Content';
  };
  attributes: {
    rich_text: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
  };
}

export interface BlogIFrame extends Struct.ComponentSchema {
  collectionName: 'components_blog_i_frames';
  info: {
    description: 'Embed iframe HTML';
    displayName: 'IFrame';
  };
  attributes: {
    content: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface BlogImage extends Struct.ComponentSchema {
  collectionName: 'components_blog_images';
  info: {
    description: 'Single image block';
    displayName: 'Image';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'videos'> &
      Schema.Attribute.Required;
  };
}

export interface HistoryHistory extends Struct.ComponentSchema {
  collectionName: 'components_history_histories';
  info: {
    description: '';
    displayName: 'History';
    icon: 'bulletList';
  };
  attributes: {
    action: Schema.Attribute.Enumeration<['crear', 'editar', 'eliminar']>;
    madeAt: Schema.Attribute.DateTime & Schema.Attribute.Required;
    madeBy: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'blog.carousel': BlogCarousel;
      'blog.content': BlogContent;
      'blog.i-frame': BlogIFrame;
      'blog.image': BlogImage;
      'history.history': HistoryHistory;
    }
  }
}
