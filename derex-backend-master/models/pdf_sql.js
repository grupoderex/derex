const knexSingleton = require("./../lib/knex/knex.singleton");
const fs = require("fs/promises");
const path = require("path");
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

const getPdf = async (pdfId) => {
  try {
    const pdf = await knex("pdfs")
      .select("name", "s3_url")
      .where("id", pdfId)
      .first();
    return { name: pdf.name, url: pdf.s3_url };
  } catch (error) {
    console.error("Error al obtener el PDF:", error);
    throw error;
  }
};

const setPdf = async (pdfFile) => {
  try {
    const pdfBuffer = pdfFile.buffer;
    const originalName = pdfFile.originalname.replace(/\.pdf$/i, "");
    const timestamp = new Date().getTime();
    const fileName = originalName
      ? `${originalName}_${timestamp}`
      : `pdf_${timestamp}`;
    const pdfKey = `pdfs/${fileName}.pdf`;

    const uploadResult = await uploadToStorage({
      key: pdfKey,
      buffer: pdfBuffer,
      contentType: "application/pdf",
    });

    const [newPdfId] = await knex("pdfs").insert({
      name: pdfFile.originalname,
      s3_url: uploadResult.url,
    });

    return {
      success: true,
      pdfId: newPdfId,
      url: uploadResult.url,
    };
  } catch (error) {
    console.error("Error al establecer el PDF:", error);
    throw error;
  }
};

const setFile = async (file) => {
  try {
    const { originalname, mimetype, buffer } = file;
    const extension = originalname.split(".").pop();
    const nameWithoutExtension = originalname.substring(
      0,
      originalname.lastIndexOf(".")
    );
    const timestamp = new Date().getTime();
    const fileName = nameWithoutExtension
      ? `${nameWithoutExtension}_${timestamp}`
      : `file_${timestamp}`;
    const folder = mimeToFolder(mimetype);
    const key = `${folder}/${fileName}.${extension}`;

    const uploadResult = await uploadToStorage({
      key,
      buffer,
      contentType: mimetype,
    });

    const [newMediaId] = await knex("media").insert({
      media_data: uploadResult.url,
      media_type: "file",
    });

    return {
      success: true,
      fileId: newMediaId,
      url: uploadResult.url,
    };
  } catch (error) {
    console.error("Error al establecer el archivo:", error);
    throw error;
  }
};

const mimeToFolder = (mimetype) => {
  return mimetype.replace("/", "-").toLowerCase();
};

const deletePdfById = async (pdfId) => {
  try {
    return await knex("pdfs").where("id", pdfId).del();
  } catch (error) {
    console.error("Error al eliminar el PDF por ID:", error);
    throw error;
  }
};

module.exports = {
  getPdf,
  setPdf,
  deletePdfById,
  setFile,
};
