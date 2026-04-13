import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Interweave } from "interweave";
import { type BlogItem } from "@/models/new_blog";
import { getBlogResourceUrl } from "@/utils/image.utils";
import Image from "next/image";

interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  article: BlogItem;
}

export const BlogCard = ({ article, className, ...props }: BlogCardProps) => {
  const { t, i18n } = useTranslation("translations");
  const thumbnailSrc =
    getBlogResourceUrl(article.thumbnail?.url) ??
    "/images/blog/img_blogPageHeader.png";

  return (
    <Link href={`/blog/${article.slug}`}>
      <Card
        {...props}
        className={`${className} border-0 shadow-none flex flex-col h-full`}
      >
        <CardHeader className="p-0 relative space-y-0">
          <div className="relative w-full aspect-video">
            <Image
              src={thumbnailSrc}
              alt={article.title ?? ""}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute top-1 left-0 w-full lg:h-full h-full z-10 bg-custom-fade" />
          {article.category && (
            <div className="absolute top-0 right-0 z-20 text-sm bg-white text-primary px-2 py-1 font-semibold rounded-bl-2xl">
              {article.category.name}
            </div>
          )}
          {/* <div className="absolute bottom-2 left-2 z-20 text-sm bg-white px-2 py-1 font-semibold rounded-full border-foreground border-solid border-[1px]">
            {dayjs(article.createdAt)
              .locale(i18n.language)
              .format("DD MMMM YYYY")}
          </div> */}
        </CardHeader>
        <CardContent className="px-4 pt-2">
          <CardTitle className="text-lg">{article.title}</CardTitle>
          <div className="text-sm text-foreground-soft line-clamp-4 mt-3">
            <Interweave
              content={article.content
                ?.map((it) =>
                  it.__component === "blog.content" ? it.rich_text : ""
                )
                .join("\n")}
              noHtml
            />
          </div>
        </CardContent>
        <div className="grow" />
        <CardFooter className="text-neutral-400 p-4 pt-2 flex flex-row items-center gap-2 mt-auto">
          {/* {article.createdBy && ( TODO: Descomentar cuando se active el link de autor
            <Link
              to={`/blog/${article.slug}`}
              className="flex flex-row items-center gap-2"
            >
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {article.createdBy.firstname[0]}
                  {article.createdBy.lastname[0]}
                </AvatarFallback>
              </Avatar>
               <Link /> 
                className="underline"
                to={`/blog/autor?firstName=${article.createdBy.firstname}&lastName=${article.createdBy.lastname}`}
              >
                {article.createdBy.firstname} {article.createdBy.lastname}
              </Link> 
            </Link>
          )}
          | */}
          <span>
            {t("minutesOfReadingShort", {
              minutes: Math.ceil(
                article?.content
                  ?.map((it) =>
                    it.__component === "blog.content" ? it.rich_text : ""
                  )
                  .join("\n")
                  .split(" ").length / 180
              ),
            })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};
