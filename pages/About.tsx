import React from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import Landing from '../Components/MainLayout/Landing/Landing';
import Aboutme from '../Components/Home/partials/Aboutme';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Me - Sorsay</title>
        <meta name="description" content="Learn more about the Sorsay project, our objectives, roadmap, and how you can contribute." />
        <meta property="og:title" content="About Me - Sorsay" />
        <meta property="og:description" content="Learn more about the Sorsay project, our objectives, roadmap, and how you can contribute." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/sorsayv2.png" />
      </Head>
      <Landing />
      <main className="py-10 px-10 md:px-[20%] flex flex-col gap-6">
        <h1 className="text-4xl font-bold">About Me</h1>
        <section>
          <p>
            Sorsay is an initiative that enhances the Khmer typing experience, promotes the use of the language, and provides educational tools for typing practice. Our approach is data-driven, allowing for continuous improvement and refinement of our technology.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Objectives</h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Enhanced Khmer Typing:</strong> Streamlining the typing process with a keyboard that converts Romanized inputs into Khmer Unicode.
            </li>
            <li>
              <strong>Promoting Language Usage:</strong> Encouraging the digital use of Khmer language by providing user-friendly solutions.
            </li>
            <li>
              <strong>Educational Tools:</strong> Offering a fun, interactive typing game to help users improve their Khmer typing skills.
            </li>
            <li>
              <strong>Data Improvement:</strong> Utilizing user data to enhance our keyboard and algorithm, aiding in the development of a comprehensive Khmer dictionary.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Roadmap</h2>
          <ul className="list-disc list-inside">
            <li>
              <strong>Phase 1:</strong> Sorsay Keyboard Web Implementation
            </li>
            <li>
              <strong>Phase 2:</strong> Interactive Typing Game & Community Engagement
            </li>
            <li>
              <strong>Phase 3:</strong> Comprehensive Khmer Dictionary
            </li>
            <li>
              <strong>Phase 4:</strong> Native Keyboard
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">How to Contribute</h2>
          <p>
            Whether you're a developer, a designer, a linguist, or just someone enthusiastic about our mission, there are several ways you can contribute: Development, Design, Data, Testing, and Content.
          </p>
        </section>
      </main>
      <Aboutme />
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default About;

