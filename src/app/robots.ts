import type { MetadataRoute } from "next";
import { robotsRules } from "@/lib/seo/crawl";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return robotsRules();
}
