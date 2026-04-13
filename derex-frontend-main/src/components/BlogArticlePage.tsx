"use client";
import { BlogCarousel } from "@/components/blog/BlogCarousel";
import { RelatedBlogsSection } from "@/components/blog/RelatedBlogsSection";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import "@/i18n";
import { getBlogBySlug } from "@/utils/api";
import { getBlogResourceUrl } from "@/utils/image.utils";
import { useQuery } from "@tanstack/react-query";
import { useWindowScroll } from "@uidotdev/usehooks";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { ALLOWED_TAG_LIST, Interweave } from "interweave";
import Link from "next/link";
import { useParams } from "next/navigation";
import CopyToClipboard from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from "react-share";
import Embed from "react-tiny-oembed";
import { toast } from "react-toastify";
dayjs.extend(localizedFormat);

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Fragment, useEffect } from "react";

const enabledSns = [
  {
    Component: FacebookShareButton,
    iconId: "fa6-brands:facebook",
    name: "facebook",
  },
  {
    Component: LinkedinShareButton,
    iconId: "fa6-brands:linkedin",
    name: "linkedin",
  },
  {
    Component: PinterestShareButton,
    iconId: "fa6-brands:pinterest",
    name: "pinterest",
  },
  {
    Component: TwitterShareButton,
    iconId: "fa6-brands:square-x-twitter",
    name: "twitter",
  },
  {
    Component: EmailShareButton,
    iconId: "fa6-solid:envelope",
    name: "email",
  },
  {
    Component: TelegramShareButton,
    iconId: "fa6-brands:telegram",
    name: "telegram",
  },
];

interface BlogArticlePageProps {
  state: "published" | "draft";
}

export default function BlogArticlePage(props: BlogArticlePageProps) {
  const { t, i18n } = useTranslation("translations");
  const { slug } = useParams() as { slug: string };

  useEffect(() => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "view_post_blog",
        pagePath: window.location.href,
      });
    }
  }, []);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", i18n.language, slug, props.state],
    queryFn: async () =>
      await getBlogBySlug(i18n.language, slug ?? "", props.state),
    enabled: !!slug,
    refetchOnWindowFocus: false,
  });

  const [{ y: scrollY }] = useWindowScroll();
  const shouldShowFloatingShare = (scrollY ?? 0) > 420;

  if (isLoading)
    return (
      <div className="py-16 flex flex-col gap-8">
        <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-8">
          <Skeleton className="w-96">
            <h3>&nbsp;</h3>
          </Skeleton>
          <section>
            <div className="flex flex-row flex-wrap gap-2">
              {Array.from({
                length: 2,
              }).map((_tag, index) => (
                <Skeleton key={index} className="w-16 h-10" />
              ))}
            </div>
          </section>
          <section className="text-neutral-400">
            <Skeleton className="w-96">
              <span>&nbsp;</span>
            </Skeleton>
          </section>
          <section className={`flex flex-row gap-4 mt-2 flex-wrap [&>*]:z-10`}>
            {Array.from({
              length: 5,
            }).map((_i, index) => (
              <Skeleton key={index} className="w-6 h-6" />
            ))}
          </section>
        </div>
        <div className="w-full max-w-3xl mx-auto px-4 flex flex-col">
          {Array.from({
            length: 50,
          }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-4"
              style={{
                width: "100%",
                marginBottom: index % 4 === 0 ? 32 : 8,
              }}
            />
          ))}
        </div>
      </div>
    );

  if (!article)
    return (
      <div className="container py-16 flex justify-center items-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>{t("articleNotFound")}</CardTitle>
          </CardHeader>
          <CardContent>{t("articleNotFoundDescription")}</CardContent>
          <CardFooter className="flex gap-4">
            <Button asChild variant={"outline"}>
              <Link href="/blog">{t("backToBlog")}</Link>
            </Button>
            <Button
              onClick={() => {
                i18n.changeLanguage(i18n.language === "en" ? "es" : "en");
              }}
            >
              {t("changeLanguage")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <div className="py-16 flex flex-col gap-8">
      <div className="w-full max-w-3xl mx-auto px-4 flex flex-col gap-8">
        <Breadcrumb className="m-0">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog">{t("javerBlog")}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-primary font-bold">
                {article?.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h3 className="text-5xl">{article?.title}</h3>
        <section>
          <div className="flex flex-row flex-wrap gap-2">
            {article?.category && (
              <Button variant="outline" asChild>
                <Link
                  href={`/blog/categoria?${new URLSearchParams({
                    topic: article?.category?.name ?? "",
                  }).toString()}`}
                >
                  {article?.category?.name}
                </Link>
              </Button>
            )}
            {article?.tags?.map((tag, index) => (
              <Button key={index} variant="outline" asChild>
                <Link
                  href={`/blog/tema?${new URLSearchParams({
                    topic: article?.category?.name ?? "",
                  }).toString()}`}
                >
                  {tag.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>
        <section className="text-neutral-400">
          {/* {dayjs(article?.createdAt).locale(i18n.language).format("LL")} |{" "} */}
          {t("minutesOfReading", {
            minutes: Math.ceil(
              (article?.content
                ?.map((it) =>
                  it.__component === "blog.content" ? it.rich_text : ""
                )
                .join("\n")
                .split(" ").length ?? 0) / 180
            ),
          })}
        </section>
        <section className={`flex flex-row gap-4 mt-2 flex-wrap [&>*]:z-10`}>
          {enabledSns.map(({ Component, iconId, name }, index) => (
            <Component
              key={index}
              url={window.location.href}
              media={getBlogResourceUrl(article?.thumbnail?.url) ?? ""}
              onClick={() => {
                if (typeof window !== "undefined" && window.dataLayer) {
                  window.dataLayer.push({
                    event: "share_post_blog",
                    pagePath: window.location.href,
                    provider: name,
                  });
                }
              }}
            >
              <Icon icon={iconId} width="32" />
            </Component>
          ))}
        </section>
      </div>
      {(article?.cover?.url || article?.thumbnail?.url) && (
        <div className="w-full max-w-3xl mx-auto px-4">
          <Image
            src={
              getBlogResourceUrl(article?.cover?.url ?? article?.thumbnail?.url) ??
              "/images/blog/img_blogPageHeader.png"
            }
            alt={article?.cover?.alternativeText ?? article?.title ?? ""}
            className="w-full aspect-video object-cover rounded-lg"
            width={1000}
            height={700}
          />
        </div>
      )}
      {article?.content?.map((content, index) => {
        switch (content.__component) {
          case "blog.content":
            return (
              <div key={index} className="w-full max-w-3xl mx-auto px-4">
                <Interweave
                  allowList={[...ALLOWED_TAG_LIST, "iframe", "oembed"]}
                  transform={(node) => {
                    if (node.tagName === "OEMBED") {
                      return (
                        <Embed
                          url={node.attributes.getNamedItem("url")?.value ?? ""}
                        />
                      );
                    }

                    return undefined;
                  }}
                  className="[&>ul]:list-disc [&>ol]:list-decimal [&>ul]:mb-3 [&>ol]:mb-3 [&>ul]:ml-5 [&>ol]:ml-5 [&>p]:my-3 whitespace-pre-wrap blog-titles"
                  content={content.rich_text}
                />
              </div>
            );
          case "blog.carousel":
            if (!content?.media || content.media.length === 0) return <Fragment key={index} />;
            return (
              <div key={index} className="w-full max-w-3xl mx-auto px-4">
                <BlogCarousel images={content.media} />
              </div>
            );
          case "blog.image":
            if (!content?.image?.url) return <Fragment key={index} />;
            return (
              <div key={index} className="w-full max-w-3xl mx-auto px-4">
                <Image
                  src={
                    getBlogResourceUrl(content.image.url) ??
                    "/images/blog/img_blogPageHeader.png"
                  }
                  alt={content.image.alternativeText ?? ""}
                  className="w-full aspect-video object-cover"
                  width={1000}
                  height={1000}
                />
              </div>
            );
          case "blog.i-frame":
            return (
              <div className="w-full max-w-3xl mx-auto px-4">
                <Interweave
                  key={index}
                  content={content.content}
                  allowList={["iframe"]}
                />
              </div>
            );
        }

        return <Fragment key={index} />;
      })}

      <div className="container flex flex-col items-center gap-8">
        <h5>{t("didYouLikeThisArticle")}</h5>
        <CopyToClipboard
          onCopy={() => {
            toast.success(t("copyLinkSuccess"));
          }}
          text={window.location.href}
        >
          <Button>
            <Icon icon="heroicons-solid:link" width="20" className="mr-2" />
            <span>{t("copyLink")}</span>
          </Button>
        </CopyToClipboard>
      </div>
      <div className="container">
        {article?.tags && article.id && (
          <RelatedBlogsSection
            topics={article.tags.map((tag) => tag.name)}
            isHome={false}
            articleId={article.id}
          />
        )}
      </div>
      <section
        className={`fixed top-96 left-4 z-10 flex flex-col gap-4 flex-wrap [&>*]:z-10 transition-opacity duration-200 ${
          shouldShowFloatingShare
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {enabledSns.map(({ Component, iconId, name }, index) => (
          <Component
            key={index}
            url={window.location.href}
            media={getBlogResourceUrl(article?.thumbnail?.url) ?? ""}
            onClick={() => {
              if (typeof window !== "undefined" && window.dataLayer) {
                window.dataLayer.push({
                  event: "share_post_blog",
                  pagePath: window.location.href,
                  provider: name,
                });
              }
            }}
          >
            <Icon icon={iconId} width="32" />
          </Component>
        ))}
      </section>
    </div>
  );
}
