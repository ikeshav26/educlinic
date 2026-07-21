export interface LeadershipMessage {
  id: string;
  title: string;
  salutation?: string;
  name: string;
  role: string;
  image: string;
  imageAlt?: string;
  highlights?: string[];
  content: string[];
}

export const leadershipMessages: LeadershipMessage[] = [
  {
    id: 'chairman-message',
    title: 'Message from the Chairman',
    salutation: 'Respected Parents & Dear Students,',
    name: 'Dr. Gurmeet Singh Dhaliwal',
    role: '(Chairman)',
    image: '/images/chairman.png',
    imageAlt: 'Dr. Gurmeet Singh Dhaliwal - Chairman BFGI',
    highlights: [
      '30+ Years of Educational Excellence since 1994',
      'Pioneering Education 4.0 & Experiential Learning',
      'Transforming towards Multidisciplinary Baba Farid University'
    ],
    content: [
      'It gives me immense pleasure to welcome you to the Baba Farid Group of Institutions (BFGI). From our humble beginnings in 1994 to the emergence of BFGI as a multidisciplinary academic ecosystem, our journey has been guided by the vision of empowering young minds through quality education, innovation, and societal development.',
      'In response to the rapidly evolving global landscape, BFGI has embraced Education 4.0 with student-centric flipped classrooms, project-based learning, and cutting-edge research in Artificial Intelligence, IoT, and Extended Reality. Through our School of Skill Development and School of Entrepreneurship, we prepare students to become problem solvers, innovators, and responsible global citizens.',
      'As we move forward into a transformative phase of establishing a multidisciplinary Baba Farid University, we remain committed to nurturing talent, character, and leadership. I warmly welcome all students and parents to join the BFGI family in shaping a future built on knowledge, innovation, and excellence.'
    ]
  },
  {
    id: 'campus-director-message',
    title: 'Message from the Campus Director',
    salutation: 'Dear Aspirants & Future Leaders,',
    name: 'Prof. (Dr.) M.P. Poonia',
    role: 'Campus Director',
    image: '/images/director.png',
    imageAlt: 'Prof. (Dr.) M.P. Poonia - Campus Director BFGI',
    highlights: [
      'Holistic Academic & Professional Excellence',
      '10 Pioneering Learning & Innovation Initiatives',
      'Global Internships & Industry Immersion'
    ],
    content: [
      'At BFGI, we are dedicated to producing future leaders and innovators poised to enact positive transformations on a global scale. Our vibrant campus, esteemed faculty, and cutting-edge facilities converge to foster an environment conducive to academic, professional, and personal excellence across engineering, management, healthcare, and emerging fields.',
      'With a robust emphasis on experiential learning, industry immersion, and groundbreaking research, 10 pioneering initiatives have been launched to elevate BFGI to global standards. We empower students with abundant avenues for extracurricular pursuits, immersive internships, and global outreach programs.',
      'I extend a warm invitation to all self-motivated aspirants to become integral members of our vibrant learning community. Embark on your journey of exploration, growth, and triumph today—your pathway to a promising future commences right here.'
    ]
  }
];
