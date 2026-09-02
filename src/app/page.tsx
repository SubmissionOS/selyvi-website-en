import { Reveal } from "@/components/motion/reveal";
import { HomeJsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { AudienceSwitch } from "@/components/sections/audience-switch";
import { WhyWeExist } from "@/components/sections/why-we-exist";
import { StoryLine } from "@/components/sections/story-line";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { TakeALook } from "@/components/sections/take-a-look";
import { FromPractice } from "@/components/sections/from-practice";
import { Features } from "@/components/sections/features";
import { ValueForAll } from "@/components/sections/value-for-all";
import { Privacy } from "@/components/sections/privacy";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";

/**
 * Startseite.
 *
 * Reine Komposition – jede Sektion liegt als eigene Komponente unter
 * src/components/sections/. Die H1 traegt ausschliesslich der Hero, alle
 * weiteren Sektionen beginnen mit einer H2.
 *
 * <Testimonials /> steht bewusst in der Reihenfolge, rendert aber `null`,
 * solange das Flag SHOW_TESTIMONIALS aus ist. So bleibt die Position der
 * Sektion sichtbar, ohne dass Platzhalter-Zitate entstehen.
 */
export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <Hero />
      <Reveal>
        <TrustBar />
      </Reveal>
      <Reveal>
        <AudienceSwitch />
      </Reveal>
      <Reveal>
        <WhyWeExist />
      </Reveal>

      <StoryLine>
        We did not learn about those evenings from a market report. We learned about them
        at a kitchen table, from a trainee teacher who showed us where the time really
        goes.
      </StoryLine>

      <Reveal>
        <ProblemSolution />
      </Reveal>

      <Reveal>
        <TakeALook />
      </Reveal>
      <Reveal>
        <FromPractice />
      </Reveal>
      <Reveal>
        <Features />
      </Reveal>

      <StoryLine>
        Every part of this started as something said in a staffroom. Some of it exists
        because one teacher would not let it drop.
      </StoryLine>

      <Reveal>
        <ValueForAll />
      </Reveal>
      <Reveal>
        <Privacy />
      </Reveal>
      <Testimonials />
      <Reveal>
        <Faq />
      </Reveal>

      <StoryLine>
        We sat in those classrooms ourselves, long enough. Now we build for the people
        who stayed late for us.
      </StoryLine>

      <FinalCta withMission />
    </>
  );
}
