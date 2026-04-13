
import { About } from 'src/pages/cms/about/about';
import TitlesPage from 'src/pages/cms/titles/titles';
import { FAQPage } from 'src/pages/cms/faq/faq-page';
import { SocialPage } from 'src/pages/cms/social/social-page';
import { FooterPage } from 'src/pages/cms/footer/footer-page';
import { KnowJaver } from 'src/pages/cms/know-javer/know-javer';
import { CreditsPage } from 'src/pages/cms/credits/credits-page';
import { PrivacyPage } from 'src/pages/cms/privacy/privacy-page';
import { UpsertFAQPage } from 'src/pages/cms/faq/upsert-faq-page';
import HomeContactPage from 'src/pages/cms/home_contact/home-contact';
import { DecaloguePage } from 'src/pages/cms/decalogue/decalogue-page';
import { UpsertSocialPage } from 'src/pages/cms/social/upsert-social-page';
import { UpsertFooterPage } from 'src/pages/cms/footer/upsert-footer-page';
import { UpsertCreditsPage } from 'src/pages/cms/credits/upsert-credits-page';
import { UpsertPrivacyPage } from 'src/pages/cms/privacy/upsert-privacy-page';
import { UpsertDecaloguePage } from 'src/pages/cms/decalogue/upsert-decalogue-page';
import { UpsertPrivacySectionPage } from 'src/pages/cms/privacy/upsert-privacy-section-page';
import { ClientExperiencePage } from 'src/pages/cms/client-experience/client-experience-page';
import { UpsertExperiencePage } from 'src/pages/cms/client-experience/upsert-experience-page';
import { UpsertDecalogueSectionPage } from 'src/pages/cms/decalogue/upsert-decalogue-section-page';
import { CertificationsAndAwardsPage } from 'src/pages/cms/certifications-and-awards/certifications-and-awards-page';
import { UpsertCertificationsAndAwardsPage } from 'src/pages/cms/certifications-and-awards/upsert-certifications-and-awards-page';

export const cmsRoutes = [
  { path: 'cms/titles', element: <TitlesPage /> },
  { path: 'cms/about', element: <About /> },
  { path: 'cms/know-javer', element: <KnowJaver /> },
  { path: 'cms/client-experience', element: <ClientExperiencePage /> },
  { path: 'cms/client-experience/create', element: <UpsertExperiencePage isCreate /> },
  { path: 'cms/client-experience/:id', element: <UpsertExperiencePage isReadOnly /> },
  { path: 'cms/client-experience/:id/edit', element: <UpsertExperiencePage isEdit /> },
  { path: 'cms/faq', element: <FAQPage /> },
  { path: 'cms/faq/create', element: <UpsertFAQPage isCreate /> },
  { path: 'cms/faq/:id', element: <UpsertFAQPage isReadOnly /> },
  { path: 'cms/faq/:id/edit', element: <UpsertFAQPage isEdit /> },
  { path: 'cms/home-contact', element: <HomeContactPage /> },
  { path: 'cms/certifications-and-awards', element: <CertificationsAndAwardsPage /> },
  {
    path: 'cms/certifications-and-awards/create',
    element: <UpsertCertificationsAndAwardsPage isCreate />,
  },
  {
    path: 'cms/certifications-and-awards/:id',
    element: <UpsertCertificationsAndAwardsPage isReadOnly />,
  },
  {
    path: 'cms/certifications-and-awards/:id/edit',
    element: <UpsertCertificationsAndAwardsPage isEdit />,
  },
  { path: 'cms/credits', element: <CreditsPage /> },
  { path: 'cms/credits/create', element: <UpsertCreditsPage isCreate /> },
  { path: 'cms/credits/:id', element: <UpsertCreditsPage isReadOnly /> },
  { path: 'cms/credits/:id/edit', element: <UpsertCreditsPage isEdit /> },
  { path: 'cms/social', element: <SocialPage /> },
  { path: 'cms/social/create', element: <UpsertSocialPage isCreate /> },
  { path: 'cms/social/:id', element: <UpsertSocialPage isReadOnly /> },
  { path: 'cms/social/:id/edit', element: <UpsertSocialPage isEdit /> },
  { path: 'cms/footer', element: <FooterPage /> },
  { path: 'cms/footer/create', element: <UpsertFooterPage isCreate /> },
  { path: 'cms/footer/:id', element: <UpsertFooterPage isReadOnly /> },
  { path: 'cms/footer/:id/edit', element: <UpsertFooterPage isEdit /> },
  { path: 'cms/decalogue', element: <DecaloguePage /> },
  { path: 'cms/decalogue/create', element: <UpsertDecaloguePage isCreate /> },
  { path: 'cms/decalogue/:id', element: <UpsertDecaloguePage isReadOnly /> },
  { path: 'cms/decalogue/:id/edit', element: <UpsertDecaloguePage isEdit /> },
  { path: 'cms/decalogue-section/create', element: <UpsertDecalogueSectionPage isCreate /> },
  { path: 'cms/decalogue-section/:id', element: <UpsertDecalogueSectionPage isReadOnly /> },
  { path: 'cms/decalogue-section/:id/edit', element: <UpsertDecalogueSectionPage isEdit /> },
  { path: 'cms/privacy', element: <PrivacyPage /> },
  { path: 'cms/privacy/create', element: <UpsertPrivacyPage isCreate /> },
  { path: 'cms/privacy/:id', element: <UpsertPrivacyPage isReadOnly /> },
  { path: 'cms/privacy/:id/edit', element: <UpsertPrivacyPage isEdit /> },
  { path: 'cms/privacy-section/create', element: <UpsertPrivacySectionPage isCreate /> },
  { path: 'cms/privacy-section/:id', element: <UpsertPrivacySectionPage isReadOnly /> },
  { path: 'cms/privacy-section/:id/edit', element: <UpsertPrivacySectionPage isEdit /> },
];
