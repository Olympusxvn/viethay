import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Globe } from "lucide-react";
import { VietHayLogo } from "@/components/shell/viethay-logo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="viethay-landing relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(124,58,237,.35),transparent_55%),radial-gradient(900px_520px_at_90%_0%,rgba(6,182,212,.28),transparent_60%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-10">
        <VietHayLogo size="md" />
        <div className="flex gap-2">
          <Button variant="ghost" className="text-[#e9eaf2]/80" render={<Link href="/settings" />}>
            Settings
          </Button>
          <Button
            className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8a3d] text-[#0b0d12]"
            render={<Link href="/generate" />}
          >
            Open App
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-8 text-center md:pt-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#e9eaf2]/70">
          <Sparkles className="size-3 text-[#ff8a3d]" />
          Unbound Creativity · TRAE SOLO @ Vietnam · Video Generation Track
        </div>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-[#f5f5f7] md:text-5xl lg:text-6xl">
          Từ mô tả sản phẩm đến{" "}
          <span className="bg-gradient-to-r from-[#ff4d4d] via-[#ff8a3d] to-[#ffd15c] bg-clip-text text-transparent">
            video bán hàng viral
          </span>{" "}
          trong 60 giây
        </h1>

        <p className="mt-5 max-w-2xl text-base text-[#e9eaf2]/70 md:text-lg">
          VietHay giúp seller Shopee, TikTok Shop & Lazada tạo video marketing
          chất lượng cao, văn hóa Việt, tối ưu cho PixVerse — 100% xây bằng TRAE
          SOLO.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="h-11 gap-2 bg-gradient-to-r from-[#ff4d4d] via-[#ff8a3d] to-[#ffd15c] px-8 text-[#0b0d12] hover:opacity-90"
            render={<Link href="/generate" />}
          >
            Bắt đầu tạo video
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 border-white/15 bg-white/5"
            render={<Link href="/history" />}
          >
            Xem History
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
          <Feature
            icon={<Zap className="size-5 text-[#ff8a3d]" />}
            title="60 giây"
            desc="Script + storyboard + video 30s+ tự động"
          />
          <Feature
            icon={<Globe className="size-5 text-cyan-400" />}
            title="Văn hóa VN"
            desc="FOMO, gần gũi, premium cho thị trường địa phương"
          />
          <Feature
            icon={<Sparkles className="size-5 text-violet-400" />}
            title="PixVerse"
            desc="Tích hợp prompt engine + API key tự nhập"
          />
        </div>

        <p className="mt-12 text-xs text-[#e9eaf2]/45">
          Built with ❤️ in Vietnam · Quoc Cuong Vo · Powered by TRAE SOLO
        </p>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
      <div className="mb-2">{icon}</div>
      <div className="font-medium text-[#f5f5f7]">{title}</div>
      <div className="mt-1 text-sm text-[#e9eaf2]/60">{desc}</div>
    </div>
  );
}
