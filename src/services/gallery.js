import db from '../models/index.js';
const { Gallery } = db;

const createGallery = async (file, fileType) => {
    try {
        const gallery = await Gallery.create({ gallery_url: file, url_type: fileType });
        return gallery;
    } catch (error) {
        throw new Error("Failed to create gallery" + error);
    }
};

const getAllGalleries = async () => {
    try {
        const galleries = await Gallery.findAll();
        return galleries;
    } catch (error) {
        throw new Error("Failed to retrieve galleries" + error);
    }
};

const getGalleryByUUID = async (uuid) => {
    try {
        const gallery = await Gallery.findOne({ where: { uuid } });
        return gallery;
    } catch (error) {
        throw new Error("Failed to retrieve gallery" + error);
    }
};

const updateGallery = async (uuid, file, fileType) => {
    try {
        const updatedGallery = await Gallery.update({ gallery_url: file, url_type: fileType }, { where: { uuid } });
        return updatedGallery;
    } catch (error) {
        throw new Error("Failed to update gallery" + error);
    }
};

const deleteGallery = async (uuid) => {
    try {
        await Gallery.destroy({ where: { uuid } });
    } catch (error) {
        throw new Error("Failed to delete gallery" + error);
    }
};

export { createGallery, getAllGalleries, getGalleryByUUID, updateGallery, deleteGallery };
