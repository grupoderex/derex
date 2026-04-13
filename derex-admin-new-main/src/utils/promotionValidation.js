export function validatePromotionData(dataPromotion) {
  try {
    // Validar el campo 'name'
    if (!dataPromotion.title_es || dataPromotion.name.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (!dataPromotion.title_en || dataPromotion.name.length < 3) {
      return 'El nombre debe tener al menos 3 caracteres';
    }

    if (dataPromotion.description_es || dataPromotion.description_es > 3) {
      return 'La descripción debe tener al menos 3 caracteres';
    }

    if (dataPromotion.description_en || dataPromotion.description_en > 3) {
      return 'La descripción debe tener al menos 3 caracteres';
    }

    if (dataPromotion.promo_image) {
      if (!dataPromotion.promo_image.length < 3) {
        return 'La imagen debe tener al menos 3 caracteres';
      }
    }
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!dataPromotion.promo_image || !urlRegex.test(dataPromotion.promo_image)) {
      return 'Debe subir una imagen';
    }

    return undefined;
  } catch {
    return 'Error al validar la promoción';
  }
}
