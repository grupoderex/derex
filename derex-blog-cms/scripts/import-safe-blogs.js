const fs = require('fs');
const path = require('path');
const { register } = require('esbuild-register/dist/node');
const { createStrapi } = require('@strapi/strapi');

const BLOG_UID = 'api::blog.blog';
const CATEGORY_UID = 'api::category.category';
const TAG_UID = 'api::tag.tag';
const SAFE_COMPONENTS = new Set(['blog.content', 'blog.i-frame']);

function getArgValue (flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return null;
  }

  return process.argv[index + 1] ?? null;
}

function hasFlag (flag) {
  return process.argv.includes(flag);
}

function printUsage () {
  console.log([
    'Usage:',
    '  node scripts/import-safe-blogs.js --file path/to/blogs.json',
    '',
    'Options:',
    '  --file <path>        Path to the exported JSON file',
    '  --allow-drafts       Import drafts too. Default imports only published entries',
  ].join('\n'));
}

function readJsonFile (filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  const raw = fs.readFileSync(absolutePath, 'utf8');
  return {
    absolutePath,
    payload: JSON.parse(raw),
  };
}

function extractItems (payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  throw new Error('Unsupported JSON shape. Expected an array or an object with results/data.');
}

function pickFirstString (...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function normalizeStatus (item) {
  return pickFirstString(item?.status, item?.publishedAt ? 'published' : null, item?.published_at ? 'published' : null) || 'draft';
}

function normalizeCategoryName (item) {
  return pickFirstString(
    item?.category?.name,
    item?.category?.data?.name,
    item?.category?.data?.attributes?.name,
    item?.category?.label,
    item?.categoryName
  );
}

function normalizeTagNames (item) {
  const raw = item?.tags?.data || item?.tags || [];

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((tag) => pickFirstString(tag?.name, tag?.attributes?.name, tag?.data?.name))
    .filter(Boolean);
}

function normalizeBlocks (item) {
  const blocks = Array.isArray(item?.content) ? item.content : [];

  return blocks
    .filter((block) => SAFE_COMPONENTS.has(block?.__component))
    .map((block) => {
      if (block.__component === 'blog.content') {
        return {
          __component: 'blog.content',
          rich_text: block.rich_text,
        };
      }

      if (block.__component === 'blog.i-frame') {
        return {
          __component: 'blog.i-frame',
          content: block.content,
        };
      }

      return null;
    })
    .filter((block) => {
      if (!block) {
        return false;
      }

      if (block.__component === 'blog.content') {
        return typeof block.rich_text === 'string' && block.rich_text.trim().length > 0;
      }

      if (block.__component === 'blog.i-frame') {
        return typeof block.content === 'string' && block.content.trim().length > 0;
      }

      return false;
    });
}

function normalizeBlog (item) {
  return {
    title: pickFirstString(item?.title),
    slug: pickFirstString(item?.slug),
    locale: pickFirstString(item?.locale) || 'es',
    status: normalizeStatus(item),
    isFeatured: Boolean(item?.isFeatured),
    categoryName: normalizeCategoryName(item),
    tagNames: normalizeTagNames(item),
    content: normalizeBlocks(item),
  };
}

async function getRelationMaps (strapi) {
  const [categories, tags] = await Promise.all([
    strapi.documents(CATEGORY_UID).findMany({
      locale: 'es',
      status: 'published',
      pagination: { page: 1, pageSize: 200 },
    }),
    strapi.documents(TAG_UID).findMany({
      locale: 'es',
      status: 'published',
      pagination: { page: 1, pageSize: 200 },
    }),
  ]);

  const categoriesByName = new Map();
  const tagsByName = new Map();

  for (const category of categories) {
    if (category?.name && category?.documentId) {
      categoriesByName.set(category.name.trim().toLowerCase(), category.documentId);
    }
  }

  for (const tag of tags) {
    if (tag?.name && tag?.documentId) {
      tagsByName.set(tag.name.trim().toLowerCase(), tag.documentId);
    }
  }

  return { categoriesByName, tagsByName };
}

function buildCreateData (blog, relationMaps) {
  const categoryDocumentId = relationMaps.categoriesByName.get(blog.categoryName.trim().toLowerCase());
  const tagDocumentIds = blog.tagNames
    .map((name) => relationMaps.tagsByName.get(name.trim().toLowerCase()))
    .filter(Boolean);

  return {
    data: {
      title: blog.title,
      slug: blog.slug,
      isFeatured: blog.isFeatured,
      category: categoryDocumentId,
      tags: tagDocumentIds.length > 0 ? { set: tagDocumentIds } : { set: [] },
      content: blog.content,
    },
    locale: blog.locale,
    status: blog.status === 'published' ? 'published' : 'draft',
  };
}

function isUniqueConstraintError (error) {
  const message = error?.message || '';
  return message.includes('UNIQUE constraint failed') || message.includes('unique') || message.includes('already exists');
}

async function run () {
  const filePath = getArgValue('--file');
  const allowDrafts = hasFlag('--allow-drafts');
  const projectRoot = process.cwd();
  const compiledAppDir = path.join(projectRoot, 'dist');

  if (!filePath) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const { absolutePath, payload } = readJsonFile(filePath);
  const items = extractItems(payload).map(normalizeBlog);
  const filtered = items.filter((item) => {
    if (!item.title || !item.slug || !item.categoryName) {
      return false;
    }

    if (!allowDrafts && item.status !== 'published') {
      return false;
    }

    return true;
  });

  const { unregister } = register({
    extensions: ['.js', '.ts'],
  });

  const strapi = await createStrapi({
    appDir: projectRoot,
    distDir: compiledAppDir,
  });
  let isLoaded = false;

  try {
    await strapi.load();
    isLoaded = true;

    const relationMaps = await getRelationMaps(strapi);
    const stats = {
      source: items.length,
      attempted: 0,
      created: 0,
      skippedInvalid: items.length - filtered.length,
      skippedMissingCategory: 0,
      skippedDuplicate: 0,
      skippedError: 0,
    };

    console.log(`Importing blogs from ${absolutePath}`);

    for (const blog of filtered) {
      const categoryDocumentId = relationMaps.categoriesByName.get(blog.categoryName.trim().toLowerCase());

      if (!categoryDocumentId) {
        stats.skippedMissingCategory += 1;
        console.log(`SKIP missing category: ${blog.title} -> ${blog.categoryName}`);
        continue;
      }

      stats.attempted += 1;

      try {
        await strapi.documents(BLOG_UID).create(buildCreateData(blog, relationMaps));
        stats.created += 1;
        console.log(`OK ${blog.status.toUpperCase()}: ${blog.title}`);
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          stats.skippedDuplicate += 1;
          console.log(`SKIP duplicate slug: ${blog.slug}`);
          continue;
        }

        stats.skippedError += 1;
        console.log(`ERROR ${blog.title}: ${error.message}`);
      }
    }

    console.log('');
    console.log('Summary');
    console.log(`  source: ${stats.source}`);
    console.log(`  attempted: ${stats.attempted}`);
    console.log(`  created: ${stats.created}`);
    console.log(`  skipped invalid: ${stats.skippedInvalid}`);
    console.log(`  skipped missing category: ${stats.skippedMissingCategory}`);
    console.log(`  skipped duplicate: ${stats.skippedDuplicate}`);
    console.log(`  skipped error: ${stats.skippedError}`);
  } finally {
    if (isLoaded) {
      await strapi.destroy();
    }

    unregister();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});