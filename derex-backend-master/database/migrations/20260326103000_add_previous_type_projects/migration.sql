ALTER TABLE project
  MODIFY type_orientation ENUM ('horizontal', 'vertical', 'mixed', 'previous') DEFAULT 'horizontal' NULL;