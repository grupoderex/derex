const customer_support_mjml_template = `<mjml>
  <mj-body background-color="#f3f3f5">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold" color="#333333">Nuevo Reporte de Servicio al Cliente</mj-text>
        <mj-text font-size="16px" color="#555555">Se ha recibido un nuevo reporte de servicio al cliente con la siguiente información:</mj-text>
        <mj-divider border-color="#cccccc"></mj-divider>
        <mj-text font-size="14px" color="#333333"><strong>Nombre:</strong> {{nombre}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Apellido:</strong> {{apellido}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Correo:</strong> {{correo}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Teléfono:</strong> {{telefono}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Fraccionamiento Adquirido:</strong> {{fraccionamiento}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Calle y Número:</strong> {{calle_numero}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Manzana:</strong> {{manzana}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Lote:</strong> {{lote}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Asunto del Mensaje:</strong> {{asunto}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Mensaje:</strong></mj-text>
        <mj-text font-size="14px" color="#555555">{{mensaje}}</mj-text>
        <mj-divider border-color="#cccccc"></mj-divider>
        <mj-image src="https://javer.com.mx/images/bar-logo.png" alt="Imagen" align="center" width="200px"></mj-image>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const future_project_mjml_template = `<mjml>
  <mj-body background-color="#f3f3f5">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="20px" font-weight="bold" color="#333333">Solicitud de Información sobre próximo lanzamiento</mj-text>
        <mj-text font-size="16px" color="#555555">Se ha recibido una nueva solicitud de información sobre un próximo lanzamiento con la siguiente información:</mj-text>
        <mj-divider border-color="#cccccc"></mj-divider>
        <mj-text font-size="14px" color="#333333"><strong>Nombre:</strong> {{nombre}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Apellido:</strong> {{apellido}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Género:</strong> {{genero}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Estado:</strong> {{estado}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Correo:</strong> {{correo}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Teléfono:</strong> {{telefono}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Desarrollo de interés:</strong> {{proyecto}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Mensaje:</strong></mj-text>
        <mj-text font-size="14px" color="#555555">{{mensaje}}</mj-text>

        <mj-divider border-color="#cccccc"></mj-divider>
        <mj-image src="https://javer.com.mx/images/bar-logo.png" alt="Javer Logo" align="center" width="200px"></mj-image>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

const future_project_mjml_custom_template = `
<mjml>
  <mj-body background-color="#f3f3f5">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-image src="https://javer.com.mx/images/bar-logo.png" alt="Javer Logo" align="center" width="200px"></mj-image>

        <mj-text font-size="20px" font-weight="bold" color="#333333" align="center">
          ¡Gracias por tu interés!
        </mj-text>

        <mj-text font-size="16px" color="#555555" align="center">
          Hemos recibido tu solicitud de información sobre uno de nuestros próximos lanzamientos. Agradecemos tu interés y muy pronto uno de nuestros asesores se pondrá en contacto contigo.
        </mj-text>

        <mj-divider border-color="#cccccc" padding="10px 0"></mj-divider>

        <mj-text font-size="16px" color="#333333" font-weight="bold">Resumen de tu solicitud:</mj-text>

        <mj-text font-size="14px" color="#333333"><strong>Nombre:</strong> {{nombre}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Apellido:</strong> {{apellido}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Género:</strong> {{genero}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Estado:</strong> {{estado}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Correo:</strong> {{correo}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Teléfono:</strong> {{telefono}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Desarrollo de interés:</strong> {{proyecto}}</mj-text>
        <mj-text font-size="14px" color="#333333"><strong>Mensaje:</strong></mj-text>
        <mj-text font-size="14px" color="#555555">{{mensaje}}</mj-text>
        <mj-divider border-color="#cccccc" padding="10px 0"></mj-divider>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

module.exports = {
  customer_support_mjml_template,
  future_project_mjml_template,
  future_project_mjml_custom_template,
};
