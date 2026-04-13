const slugify = require("slugify");
const fs = require("fs/promises");
const path = require("path");
const knexSingleton = require("./../lib/knex/knex.singleton");
const knex = knexSingleton.getKnexSingleton();
const { s3 } = require("../AWSConfig");
require("dotenv").config();

const hasAwsConfig = () => {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_CDN_URL
  );
};

const getLocalBaseUrl = () => {
  if (process.env.LOCAL_MEDIA_BASE_URL) {
    return process.env.LOCAL_MEDIA_BASE_URL.replace(/\/$/, "");
  }
  const port = Number(process.env.PORT || 3000);
  return `http://localhost:${port}`;
};

const uploadToStorage = async ({ key, buffer, contentType }) => {
  if (hasAwsConfig()) {
    await s3
      .putObject({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
      .promise();

    return {
      route: `/${key}`,
      url: `${process.env.AWS_CDN_URL}/${key}`,
    };
  }

  const absolutePath = path.join(__dirname, "..", "uploads", ...key.split("/"));
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  return {
    route: `/uploads/${key}`,
    url: `${getLocalBaseUrl()}/uploads/${key}`,
  };
};

const getMedia = async (mediaId) => {
  try {
    const media = await knex("media")
      .select("media_data", "media_type")
      .where("media_id", mediaId)
      .first();
    return { data: media.media_data, type: media.media_type };
  } catch (error) {
    console.error("Error al obtener el medio:", error);
    throw error;
  }
};

const setMedia = async (mediaFile, mediaType) => {
  try {
    let mediaBuffer;

    // Verificar si se proporcionó un archivo (multipart/form-data)
    if (mediaFile && mediaFile.buffer) {
      mediaBuffer = mediaFile.buffer;
    } else {
      // Si no hay archivo, se asume que se proporciona un base64
      mediaBuffer = Buffer.from(mediaFile, "base64");
    }

    const mediaExtension = mediaType === "image" ? "png" : "mp4";
    const timestamp = new Date().getTime(); // Obtener un timestamp único
    const mediaKey = `${mediaType === "image" ? "images" : "videos"
      }/media_${timestamp}.${mediaExtension}`;

    const uploadResult = await uploadToStorage({
      key: mediaKey,
      buffer: mediaBuffer,
      contentType: mediaType === "image" ? "image/png" : "video/mp4",
    });

    // Actualizar o insertar un nuevo registro en la base de datos con la URL del medio actual
    const [newMediaId] = await knex("media").insert({
      media_data: uploadResult.url,
      media_type: mediaType,
    });

    return {
      success: true,
      mediaId: newMediaId,
      url: uploadResult.url,
    };
  } catch (error) {
    console.error("Error al establecer el medio:", error);
    throw error;
  }
};

const setVideoDevelopment = async (mediaFile) => {
  try {
    let mediaBuffer;

    // Verificar si se proporcionó un archivo (multipart/form-data)
    if (mediaFile && mediaFile.buffer) {
      mediaBuffer = mediaFile.buffer;
    } else {
      // Si no hay archivo, se asume que se proporciona un base64
      mediaBuffer = Buffer.from(mediaFile, "base64");
    }

    // Se eliminan caracteres raros y se agrega url friendly para una mejor indezxación de google
    const fileName = slugify(mediaFile.originalname.replace(/.mp4/g, ""), {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      trim: true,
    });

    // Ruta del archivo dentro del Bucket
    const Key = `videos/desarrollos/${Number(new Date())}-${fileName}.mp4`;

    const uploadResult = await uploadToStorage({
      key: Key,
      buffer: mediaBuffer,
      contentType: "video/mp4",
    });

    return {
      success: true,
      mediaRoute: uploadResult.route,
      url: uploadResult.url,
    };
  } catch (error) {
    console.error("Error al subir el medio:", error);
    throw error;
  }
};

const setBannerProject = async (mediaFile, project_id) => {
  try {
    if (!Number(project_id)) throw error;

    let mediaBuffer;

    // Verificar si se proporcionó un archivo (multipart/form-data)
    if (mediaFile && mediaFile.buffer) {
      mediaBuffer = mediaFile.buffer;
    } else {
      // Si no hay archivo, se asume que se proporciona un base64
      mediaBuffer = Buffer.from(mediaFile, "base64");
    }

    // Se eliminan caracteres raros y se agrega url friendly para una mejor indezxación de google
    const fileName = slugify(mediaFile.originalname.replace(/.jpg/g, ""), {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
      strict: true,
      trim: true,
    });

    // Ruta del archivo dentro del Bucket
    const Key = `banners/desarrollos/${project_id}-${fileName}.jpg`;

    const uploadResult = await uploadToStorage({
      key: Key,
      buffer: mediaBuffer,
      contentType: "image/jpg",
    });

    await knex("project")
      .update({ banner_url: uploadResult.route })
      .where("id", project_id);

    return {
      success: true,
      mediaRoute: uploadResult.route,
      url: uploadResult.url,
    };
  } catch (error) {
    console.error("Error al subir el banner:", error);
    throw error;
  }
};

module.exports = {
  getMedia,
  setMedia,
  setVideoDevelopment,
  setBannerProject,
};
