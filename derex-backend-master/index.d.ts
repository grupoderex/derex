declare module Models {
  // Admin model
  type Admin = {
    id: number;
    role: AdminRole;
    name: string | null;
    email: string;
    hashed_password: string;
    phone: string | null;
    avatar: string | null;
    active: boolean | null;
    created_at: Date;
    update_at: Date;
  };

  // Amenity Property model
  type AmenityProperty = {
    id: number;
    id_property: number | null;
    name: string;
    name_eng: string;
    img_url: string;
    id_project: number | null;
  };

  // Avisos Privacidad model
  type AvisosPrivacidad = {
    ID: number;
    name: string | null;
    html_content: string | null;
    active: boolean | null;
    slug: string | null;
  };

  // Billing model
  type Billing = {
    id: number;
    id_user: number | null;
    billing_address: number | null;
    id_property: number | null;
    cp: string | null;
    rfc: string | null;
    real_estate_advisor: string | null;
    credit_type: number | null;
    status: BillingStatus | null;
    notario: string | null;
    notaria: string | null;
  };

  // Blog Posts model
  type BlogPosts = {
    id: bigint;
    language: string | null;
    region: string | null;
    post_author: string;
    post_date: Date;
    post_date_gmt: Date;
    post_title: string;
    breadcrumb_title: string | null;
    post_name: string | null;
    post_excerpt: string | null;
    description: string | null;
    post_content: string;
    post_image1: string;
    post_image2: string;
    post_status: string;
    post_modified: Date;
    post_modified_gmt: Date;
    version: number;
    post_content_filtered: string | null;
    post_type: string;
    post_mime_type: string | null;
    permalink: string;
    permalink_hash: string;
    post_section: string | null;
    active: boolean;
  };

  // City model
  type City = {
    id: number;
    name: string | null;
    id_state: number | null;
    active: boolean | null;
    created_at: Date;
    update_at: Date;
  };

  // Credit Type model
  type CreditType = {
    id: number;
    name: string | null;
    description: string | null;
    thumb_image: string | null;
    external_link: string | null;
    active: boolean | null;
    created_at: Date;
    update_at: Date;
  };

  // Documents model
  type Documents = {
    id: number;
    name: string;
    url: string;
    active: boolean;
    page: DocumentsPage;
    section: string | null;
  };

  // Keeper Old Posts model
  type KeeperOldPosts = {
    ID: number | null;
    post_author: number | null;
    post_date: string | null;
    post_date_gmt: string | null;
    post_content: string | null;
    post_title: string | null;
    post_excerpt: string | null;
    post_status: string | null;
    comment_status: string | null;
    ping_status: string | null;
    post_password: string | null;
    post_name: string | null;
    to_ping: string | null;
    pinged: string | null;
    post_modified: string | null;
    post_modified_gmt: string | null;
    post_content_filtered: string | null;
    post_parent: number | null;
    guid: string | null;
    menu_order: number | null;
    post_type: string | null;
    post_mime_type: string | null;
    comment_count: number | null;
  };

  // Log Activities model
  type LogActivities = {
    id: number;
    id_admin: number | null;
    name: string | null;
    email: string | null;
    activity: string | null;
    created_at: Date;
  };

  // Lotes Form model
  type LotesForm = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    state: string | null;
    square_meters: string | null;
    message: string | null;
    active: number | null;
  };

  // Media model
  type Media = {
    media_id: number;
    media_data: string;
    media_type: MediaMediaType;
  };

  // PDFs model
  type PDFs = {
    id: number;
    name: string;
    s3_url: string;
    created_at: Date;
    updated_at: Date;
  };

  // Prices List Property model
  type PricesListProperty = {
    id: number;
    id_property: number | null;
    name: string | null;
    price_base: number | null;
    price_m2_ext: number | null;
  };

  // Project model
  type Project = {
    id: number;
    id_city: number;
    type_project: ProjectTypeProject;
    name: string;
    short_name: string;
    description: string;
    description_eng: string | null;
    long_description: string | null;
    long_description_eng: string | null;
    logo_color: string;
    logo_color_alt_text: string | null;
    logo_grey: string | null;
    video_url: string;
    email_contact: string | null;
    phone_contact: string | null;
    featured: string;
    active: boolean | null;
    created_at: Date;
    update_at: Date;
    latitud: string | null;
    longitud: string | null;
    link_map: string | null;
    ciudad: string | null;
    colonia: string | null;
    calle: string | null;
    numero_ext: string | null;
    numero_int: string | null;
    cp: string | null;
    live_the_experience_description: string | null;
    live_the_experience_description_en: string | null;
    live_the_experience_url: string | null;
    wase_link_map: string | null;
    additional_info: AdditionalInfo | null;
    interest_area: InterestArea;
    equipment: Equipment;
    contact_form: ContactForm;
    vertical_data: VerticalData | null;
    type_orientation: "vertical" | "horizontal";
  };

  type VerticalData = {
    apartments: number;
    floors: number;
  };

  type ContactForm = {
    phone_number: string;
    opening_hours: {
      es: string;
      en: string;
    };
  };

  // Project Credits model
  type ProjectCredits = {
    id: number;
    id_project: number;
    id_credit: number;
    created_at: Date;
    update_at: Date;
  };

  // Project Promo model
  type ProjectPromo = {
    id: number;
    id_project: number;
    id_credit: number;
    valid_until: Date;
    created_at: Date;
    update_at: Date;
  };

  // Project Property Blueprints model
  type ProjectPropertyBlueprints = {
    id: number;
    id_property: number | null;
    image_url: string;
    created_at: Date;
    update_at: Date;
  };

  // Project Property Images model
  type ProjectPropertyImages = {
    id: number;
    id_property: number | null;
    image_url: string;
    created_at: Date;
    update_at: Date;
    order: boolean | null;
  };

  // Promo model
  type Promo = {
    id: number;
    name: string;
    description: string;
    square_image_url: string | null;
    banner_image_url: string;
    created_at: Date;
    update_at: Date;
  };

  // Property model
  type Property = {
    id: number;
    id_project: number | null;
    type: string | null;
    vertical_floor: number | null;
    name: string | null;
    short_name: string | null;
    description: string | null;
    description_eng: string | null;
    rooms: number | null;
    bathrooms: number | null;
    restrooms: number | null;
    delivery_status: PropertyDeliveryStatus | null;
    construction_status: string | null;
    architectural_plans_url: string | null;
    video: string | null;
    materport_video: string | null;
    cars_garage_capacity: number | null;
    cars_parking_lot_capacity: number | null;
    floors: number | null;
    square_meters: number | null;
    price_base_mxn: number | null;
    price_m2_extra_mxn: number | null;
    ubication: number | null;
    email_contact: string | null;
    phone_contact: string | null;
    featured: string | null;
    active: boolean | null;
    main_image: string | null;
    main_image_alt_text: string | null;
    main_image_vertical: string | null;
    created_at: Date | null;
    update_at: Date | null;
    project_order: number | null;
    banner: string | null;
    thumbnail: string | null;
  };

  type File = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
  };

  // Reservas Form model
  type ReservasForm = {
    id: number;
    Nombre: string | null;
    Apellido: string | null;
    Correo: string | null;
    Telefono: string | null;
    InfoTerreno: string | null;
    Estado: string | null;
    MetrosCuadrados: number | null;
    CodigoPostal: string | null;
    Hectareas: number | null;
    PrecioPorMetroCuadrado: number | null;
    Descripcion: string | null;
  };

  // Sections Footer model
  type SectionsFooter = {
    id: number;
    name: string;
    name_eng: string;
    path: string;
    active: boolean;
    section: string;
    is_url: boolean;
  };

  // Sections Navbar model
  type SectionsNavbar = {
    id: number;
    name: string;
    path: string;
    active: boolean;
    name_eng: string;
  };

  // State model
  type State = {
    id: number;
    name: string | null;
    active: boolean | null;
    banner_url: string | null;
    created_at: Date;
    update_at: Date;
  };

  // Stylings model
  type Stylings = {
    id: number;
    key: string | null;
    value: string | null;
    name: string | null;
  };

  // Ubication model
  type Ubication = {
    id: number;
    colonia: string | null;
    city: number;
    municipality: string | null;
    street: string | null;
    zip_code: string;
    address_line_1: string;
    address_line_2: string | null;
    longitude: string | null;
    latitude: string | null;
    created_at: Date;
    update_at: Date;
    city_id: number | null;
  };

  // User model
  type User = {
    id: number;
    primary_email: string | null;
    secondary_email: string | null;
    primary_phone: string | null;
    secondary_phone: string | null;
    avatar: string | null;
    active: boolean | null;
    password: string | null;
    auth_provider: UserAuthProvider | null;
    email_promos: boolean | null;
    phone_promos: boolean | null;
    ubication: number | null;
    created_at: Date;
    update_at: Date;
    last_name: string | null;
    first_name: string | null;
  };

  // User Favorites Property model
  type UserFavoritesProperty = {
    id: number;
    id_user: number;
    id_property: number;
    created_at: Date;
    update_at: Date;
  };

  type AdditionalInfo = {
    title: {
      en: string;
      es: string;
    };
    description: {
      en: string;
      es: string;
    };
    image_url: string | null;
    more_info_url: string | null;
  };

  type InterestArea = {
    sp: string[];
    en: string[];
  };

  type Equipment = {
    sp: string[];
    en: string[];
  };

  type CustomerSupport = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    acquired_subdivision: string;
    street_address: string;
    street_number: string;
    block: string;
    lot: string;
    subject: string;
    message: string;
  };

  type CustomerExperience = {
    id: number;
    description_es: string;
    description_en: string;
    project_id: number;
    url: string;
    created_at: Date;
    update_at: Date;
  };

  type FrequentQuestion = {
    id: number;
    question_es: string;
    question_en: string;
    answer_es: string;
    answer_en: string;
    url_link: string;
    open_in_new_tab: boolean;
    created_at: Date;
    update_at: Date;
  };

  type AboutUs = {
    id: number;
    index_order: number;
    image_url: string;
    is_image_left: boolean;
    content: string;
    created_at: Date;
    updated_at: Date;
  };

  type Certification = {
    id: number;
    title_es: string;
    title_en: string;
    description_es: string;
    description_en: string;
    date: Date;
    button_url: string;
    button_url_en: string;
    new_tab: boolean;
    created_at: Date;
    updated_at: Date;
    show_date: boolean;
  };

  type Social = {
    id: number;
    name: string;
    url: string;
    icon: string;
    created_at: Date;
    updated_at: Date;
  };

  type Decalogue = {
    id: number;
    title_es: string;
    title_en: string;
    content: string;
    content_date: Date;
    file: string;
  };

  type SectionDecalogue = {
    id: number;
    name_es: string;
    name_en: string;
    type: string;
  };

  type FutureProject = {
    id: number;
    main_image: string;
    main_image_alt: string;
    secondary_image: string | null;
    secondary_image_alt: string | null;
    name: string;
    state_id: number | null;
    launch_date: Date | null;
    contact_phone: string | null;
    contact_email: string;
    type: "Vertical" | "Horizontal" | "Mixed";
    created_at: Date;
    updated_at: Date;
  };

  type FutureAmenityProperty = {
    id: number;
    id_future_project: number;
    name_es: string | null;
    name_en: string | null;
    created_at: Date;
    updated_at: Date;
  };

  type PropertyUrgencyChip = {
    id: number;
    property_id: number;
    description_es: string;
    description_en: string;
    notification_text_es: string;
    notification_text_en: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
  };

  // Enums

  export enum AdminRole {
    owner = "owner",
    sales = "sales",
    marketing = "marketing",
    IT = "IT",
  }

  export enum ProjectTypeProject {
    residences = "residences",
    land = "land",
    building = "building",
  }

  export enum MediaMediaType {
    image = "image",
    video = "video",
  }

  export enum DocumentsPage {
    decalogo = "decalogo",
    avisos_privacidad = "avisos_privacidad",
    contratos_adhesion = "contratos_adhesion",
  }

  export enum UserAuthProvider {
    Google = "Google",
    Email = "Email",
    Facebook = "Facebook",
    Manual = "Manual",
  }

  export enum BillingStatus {
    requested = "requested",
    proceseed = "proceseed",
  }

  export enum PropertyDeliveryStatus {
    ready_to_move = "ready_to_move",
    white_building = "white building",
    gray_building = "gray building",
    preesale = "preesale",
  }
}
