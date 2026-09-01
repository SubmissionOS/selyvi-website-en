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
        We do not know those evenings from a market report. We know them from the kitchen
        table – from a trainee primary school teacher who showed us where the time
        actually goes.
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
        Everything in here goes back to a remark from a real staffroom. Some of it we
        built because one single teacher would not let it go.
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
        We were pupils ourselves for long enough. Now we build for the people who stayed
        late for us back then.
      </StoryLine>

      <FinalCta withMission />
    </>
  );
}
