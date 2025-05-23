
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Phone, Github, Linkedin, ExternalLink, Calendar, GraduationCap, Briefcase } from "lucide-react";

const Portfolio = () => {
  const { userId } = useParams();

  // Mock data - in a real app, you'd fetch this based on userId
  const portfolioData = {
    name: "Alex Johnson",
    title: "Full Stack Developer",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I love creating user-friendly interfaces and robust backend systems.",
    skills: ["React", "Node.js", "TypeScript", "Python", "PostgreSQL", "AWS", "Docker", "GraphQL"],
    social: {
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson"
    },
    projects: [
      {
        id: 1,
        title: "E-commerce Platform",
        description: "A full-stack e-commerce solution built with React, Node.js, and PostgreSQL. Features include user authentication, payment processing, and inventory management.",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        liveUrl: "https://example-ecommerce.com",
        githubUrl: "https://github.com/alexjohnson/ecommerce-platform",
        image: "/placeholder.svg"
      },
      {
        id: 2,
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        technologies: ["React", "TypeScript", "Socket.io", "MongoDB"],
        liveUrl: "https://example-tasks.com",
        githubUrl: "https://github.com/alexjohnson/task-manager",
        image: "/placeholder.svg"
      },
      {
        id: 3,
        title: "Weather Dashboard",
        description: "A responsive weather dashboard that displays current conditions and forecasts for multiple cities with beautiful data visualizations.",
        technologies: ["Vue.js", "Chart.js", "OpenWeather API", "Tailwind CSS"],
        liveUrl: "https://example-weather.com",
        githubUrl: "https://github.com/alexjohnson/weather-dashboard",
        image: "/placeholder.svg"
      }
    ],
    experience: [
      {
        id: 1,
        company: "TechCorp Solutions",
        position: "Senior Full Stack Developer",
        startDate: "2022-01-01",
        endDate: null,
        description: "Lead development of client-facing web applications, mentor junior developers, and collaborate with cross-functional teams to deliver high-quality software solutions."
      },
      {
        id: 2,
        company: "StartupXYZ",
        position: "Full Stack Developer",
        startDate: "2020-06-01",
        endDate: "2021-12-31",
        description: "Developed and maintained multiple web applications using React and Node.js. Implemented CI/CD pipelines and improved application performance by 40%."
      }
    ],
    education: [
      {
        id: 1,
        institution: "University of Technology",
        degree: "Bachelor of Science in Computer Science",
        startDate: "2016-09-01",
        endDate: "2020-05-31",
        description: "Graduated Magna Cum Laude with focus on software engineering and database systems."
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <Card className="mb-8 overflow-hidden bg-white shadow-lg">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={portfolioData.avatar} alt={portfolioData.name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {portfolioData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 md:ml-6 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {portfolioData.name}
                </h1>
                <p className="text-xl text-gray-600 mb-4">{portfolioData.title}</p>
                
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {portfolioData.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {portfolioData.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {portfolioData.phone}
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 justify-center md:justify-start">
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.social.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-700 leading-relaxed">{portfolioData.bio}</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Skills & Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Featured Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {portfolioData.projects.map((project) => (
                <Card key={project.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                          Live Demo
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3" />
                          Code
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Experience & Education Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Experience Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolioData.experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </div>
                    <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {portfolioData.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-purple-200 pl-4">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-purple-600 font-medium">{edu.institution}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                    </div>
                    <p className="text-gray-700 mt-2 text-sm">{edu.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
