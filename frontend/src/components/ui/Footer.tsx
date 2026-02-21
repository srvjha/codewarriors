import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <div>
      <footer className="text-zinc-300 px-6 py-12 border-t border-neutral-800 w-full">
        <div className="max-w-6xl mx-auto w-full flex flex-col justify-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 ml-28">
            <div>
              <div className=" -mt-6">
                <svg
                  width="200"
                  height="90"
                  viewBox="0 0 820 128"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1_3)">
                    <path
                      d="M147.094 80.25H156.094V90.42L145.654 96.45H121.984L111.544 90.42V38.58L121.984 32.55H145.654L156.094 38.58V48.75H147.094V40.65H120.544V88.35H147.094V80.25ZM208.748 90.42L198.308 96.45H180.938L170.498 90.42V56.58L180.938 50.55H198.308L208.748 56.58V90.42ZM179.228 58.38V88.62H200.018V58.38H179.228ZM233.584 50.55H247.174L253.564 54.24V30.3H262.294V96.45H255.724L253.564 92.76L247.174 96.45H233.584L223.144 90.42V56.58L233.584 50.55ZM253.564 88.62V58.38H231.874V88.62H253.564ZM312.22 88.17V96H287.11L276.67 89.97V56.58L287.11 50.55H301.78L312.22 56.58V76.56H285.4V88.17H312.22ZM285.4 58.38V68.73H303.49V58.38H285.4ZM402.732 33L386.532 96H375.822L362.502 45.51H362.322L349.002 96H338.292L322.092 33H330.822L343.602 84.48H343.782L357.372 33H367.452L380.952 84.48H381.132L394.002 33H402.732ZM419.567 77.55V88.62H437.657V77.55H419.567ZM421.277 96.45L410.837 90.42V75.75L421.277 69.72H437.657V58.83H415.337V51H435.947L446.387 57.03V96.45H444.047L437.657 92.76L431.267 96.45H421.277ZM485.911 58.83H469.531V96H460.801V51H467.371L469.531 54.69L475.921 51H485.911V58.83ZM520.891 58.83H504.511V96H495.781V51H502.351L504.511 54.69L510.901 51H520.891V58.83ZM539.492 51V96H530.762V51H539.492ZM530.312 39.93V30.3H539.942V39.93H530.312ZM592.127 90.42L581.687 96.45H564.317L553.877 90.42V56.58L564.317 50.55H581.687L592.127 56.58V90.42ZM562.607 58.38V88.62H583.397V58.38H562.607ZM631.633 58.83H615.253V96H606.523V51H613.093L615.253 54.69L621.643 51H631.633V58.83ZM675.344 75.3V89.97L664.904 96H641.504V88.17H666.614V77.1H651.944L641.504 71.07V57.03L651.944 51H674.444V58.83H650.234V69.27H664.904L675.344 75.3Z"
                      fill="url(#paint0_linear_1_3)"
                    />
                    <path
                      d="M58.877 66.2988L85.4551 76.2246V86.6426L50.4688 71.5078V64.3711L58.877 66.2988ZM85.4551 58.2188L58.877 68.3086L50.4688 70.1133V62.9355L85.4551 47.8418V58.2188Z"
                      fill="#DFDFDF"
                    />
                    <path
                      d="M725.781 33.2812L703.223 98.127H694.979L717.537 33.2812H725.781ZM759.209 67.9395L732.221 58.1367V47.8008L767.822 62.9355V70.1543L759.209 67.9395ZM732.221 76.3477L759.25 66.2578L767.822 64.3301V71.5078L732.221 86.6426V76.3477Z"
                      fill="#DFDFDF"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_1_3"
                      x1="103"
                      y1="64.5"
                      x2="683"
                      y2="64.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#24B2F9" />
                      <stop offset="1" stop-color="#2097D3" />
                    </linearGradient>
                    <clipPath id="clip0_1_3">
                      <rect width="820" height="128" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Empowering developers to become coding masters through practice,
                challenges, and community.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/srvjha"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="https://x.com/J_srv001"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/saurav-jha-a30362196/"
                  target="_blank"
                  className="text-gray-400 hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contest"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contest
                  </Link>
                </li>
                <li>
                  <Link
                    to="/discuss"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Discussion Forum
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sheets"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Sheets
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/problemset"
                    className="hover:text-blue-400 transition-colors"
                  >
                    API
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-blue-400 transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-blue-400 transition-colors"
                  >
                    Legal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Code Warriors. All rights
              reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-blue-400"
              >
                Privacy Policy
              </Link>
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-blue-400"
              >
                Terms of Service
              </Link>
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-blue-400"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
