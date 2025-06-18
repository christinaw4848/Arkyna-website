import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Mail, Linkedin } from "lucide-react";

const teamMembers = [
    {
        name: "Member 1",
        role: "Role 1",
        desc: "Description 1.",
        expertise: ["1", "2", "3"],
        email: "mailto:member1@email.com",
        linkedin: "https://linkedin.com/in/member1",
    },
    {
        name: "Member 2",
        role: "Role 2",
        desc: "Description 2.",
        expertise: ["1", "2", "3"],
        email: "mailto:member2@email.com",
        linkedin: "https://linkedin.com/in/member2",
    },
    {
        name: "Member 3",
        role: "Role 3",
        desc: "Description 3.",
        expertise: ["1", "2"],
        email: "mailto:member3@email.com",
        linkedin: "https://linkedin.com/in/member3",
    },
    {
        name: "Member 4",
        role: "Role 4",
        desc: "Description 4.",
        expertise: ["1", "2"],
        email: "mailto:member4@email.com",
        linkedin: "https://linkedin.com/in/member4",
    },
    {
        name: "Member 5",
        role: "Role 5",
        desc: "Description 5.",
        expertise: ["1", "2"],
        email: "mailto:member5@email.com",
        linkedin: "https://linkedin.com/in/member5",
    },
];

const expertiseColors = [
    "bg-purple-100 text-purple-700", // pastel purple

    "bg-blue-100 text-blue-700", // pastel blue
    "bg-green-100 text-green-700", // pastel green
    "bg-orange-100 text-[#a8431a]", // pastel orange
    "bg-pink-100 text-pink-600", // pastel pink

    "bg-yellow-100 text-yellow-700", // pastel yellow
];

export default function TeamCarousel() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 900,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <section id="team" className="py-20 w-full bg-[#fafafa]">
        <div className="flex flex-col items-center w-full bg-[#fafafa]">
            {/* Override slick arrow color for visibility */}
            <style>{`
        .slick-prev:before, .slick-next:before {
          color:rgb(205, 24, 3) !important;
          font-size: 36px !important;
        }
        .slick-prev, .slick-next {
          width: 40px !important;
          height: 40px !important;
          z-index: 10;
        }
        .slick-prev {
          left: -75px !important;
        }
        .slick-next {
          right: -75px !important;
        }
        @media (max-width: 900px) {
          .slick-prev {
            left: 0px !important;
          }
          .slick-next {
            right: 0px !important;
          }
        }
        /* Fix for cut-off tiles */
        .slick-slide > div {
          height: 100% !important;
          display: flex !important;
          align-items: stretch !important;
          overflow: visible !important;
        }
        .slick-track {
          min-height: 100% !important;
          overflow: visible !important;
        }
        .slick-list {
          overflow-x: hidden !important;
          overflow-y: visible !important;
          padding-bottom: 32px !important;
        }
      `}</style>
            <h2 className="text-4xl font-bold text-red-600 text-center mt-8 mb-2">
                Our Team
            </h2>
            <p className="text-lg text-gray-700 text-center mb-8">
                Meet the passionate individuals driving innovation at Arkyna:
            </p>
            <div className="w-full max-w-6xl px-0 sm:px-0">
                <Slider {...settings}>
                    {teamMembers.map((member, idx) => (
                        <div key={idx} className="flex justify-center h-full overflow-visible">
                            <div
                                className="bg-red-200 rounded-3xl p-8 text-center w-[90vw] max-w-xs sm:w-[350px] mx-auto flex flex-col items-center shadow-md h-auto overflow-visible"
                            >
                                <div
                                    className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-white"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
                                    }}
                                >
                                    {idx + 1}
                                </div>
                                <h3 className="font-bold text-2xl mb-1">
                                    {member.name}
                                </h3>
                                <div className="text-orange-600 mb-2 font-semibold">
                                    {member.role}
                                </div>
                                <div className="mb-3 text-gray-700">{member.desc}</div>
                                <div className="mb-2 font-bold text-left w-full">
                                    Expertise:
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4 w-full justify-center">
                                    {member.expertise.map((exp, i) => (
                                        <span
                                            key={i}
                                            className={`rounded-md px-3 py-1 text-xs font-medium ${expertiseColors[i % expertiseColors.length]}`}
                                        >
                                            {exp}
                                        </span>
                                    ))}
                                </div>
                                {/* Add icons or links here if needed */}
                                <div className="flex gap-4 mt-2">
                                    <a
                                        href={member.email}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Email"
                                    >
                                        <Mail className="w-6 h-6 text-[#c0392b] hover:text-[#f7971e] transition-colors" />
                                    </a>
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                    >
                                        <Linkedin className="w-6 h-6 text-[#c0392b] hover:text-[#f7971e] transition-colors" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
            {/* Add gap below the carousel section */}
            <div className="mb-16"></div>
        </div>
        </section>
    );
}
