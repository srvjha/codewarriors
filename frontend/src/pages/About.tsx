import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-white">
      <p className="text-lg mb-6 leading-relaxed text-gray-300">
        Welcome to{" "}
        <span className="font-semibold text-blue-400">Code Warriors</span>, your
        ultimate destination for mastering Data Structures & Algorithms through
        targeted practice and real-world challenges. Our mission is to empower
        developers at all levels to improve their problem-solving skills,
        prepare confidently for technical interviews, and build a strong coding
        foundation.
      </p>
      <p className="text-lg mb-6 leading-relaxed text-gray-300">
        At Code Warriors, we offer a rich collection of DSA problems organized
        by topics such as Arrays, Strings, Graphs, Dynamic Programming, and
        more. Whether you're preparing for an upcoming interview or just
        sharpening your skills, our platform provides curated company-wise
        questions, personalized progress tracking, and an intuitive interface
        designed to keep you motivated.
      </p>

      <h2 className="text-3xl font-semibold mb-6 mt-12">Platform Features</h2>
      <ul className="list-disc list-inside space-y-3 text-gray-300 mb-10">
        <li>
          <strong>Curated Problem Sets:</strong> Diverse DSA problems covering
          arrays, strings, graphs, dynamic programming, and more.
        </li>
        <li>
          <strong>Personalized Dashboard:</strong> Track solved problems,
          progress by topic, and maintain streaks.
        </li>
        <li>
          <strong>Detailed Explanations & Hints:</strong> Get insights on
          problem solutions to deepen understanding.
        </li>
        <li>
          <strong>Admin Problem Management:</strong> Efficiently add, update,
          and manage challenges.
        </li>
      </ul>

      <h2 className="text-3xl font-semibold mb-6">How to Use Code Warriors</h2>
      <ol className="list-decimal list-inside space-y-4 text-gray-300 mb-12">
        <li>
          <strong>Create an Account:</strong> Sign up to save your progress and
          personalize your experience.
        </li>
        <li>
          <strong>Explore Problems:</strong> Browse problems by topic,
          difficulty, or company tags.
        </li>
        <li>
          <strong>Attempt Challenges:</strong> Solve problems using our
          integrated code editor with instant feedback.
        </li>
        <li>
          <strong>Track Your Progress:</strong> Check your dashboard for stats
          on solved problems and streaks.
        </li>
        <li>
          <strong>Use Admin Tools:</strong> For admins, manage and curate
          problem sets to keep the platform fresh.
        </li>
      </ol>

      <div className="text-center mb-16">
        <Link to="/register">
          <button className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold transition duration-300 shadow-lg">
            Get Started Now
          </button>
        </Link>
      </div>

      <h2 className="text-3xl font-semibold mb-4">About me</h2>
      <p className="text-lg leading-relaxed text-gray-300">
        I'm Saurav Jha, a passionate software developer who loves to code and
        build tools that make learning and growth easier for developers
        worldwide. With years of experience in full-stack development and a keen
        interest in algorithmic problem solving, I created Code Warriors to
        bridge the gap between practice and success in technical interviews. My
        goal is to build a supportive community where learners can thrive,
        challenge themselves, and achieve their career goals.
      </p>
    </div>
  );
};

export default About;
