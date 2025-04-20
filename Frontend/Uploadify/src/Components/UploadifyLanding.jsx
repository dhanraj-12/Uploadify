import React from 'react';
import { FaUpload, FaYoutube, FaEdit, FaShieldAlt, FaChartLine, FaServer } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Animation components
const FadeIn = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const UploadifyLanding = () => {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState("");
  const userinfo = localStorage.getItem("user-info");
  const user = JSON.parse(userinfo);
  const image = user?.image;


  const handlestart = () => {
    navigate('/UserRole')
  }

  const handlelogin = () => {

    navigate('/login')
  }




  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <nav className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <FaUpload className="h-8 w-8 text-indigo-400" />
                </motion.div>
                <span className="ml-2 text-xl font-bold">Uploadify</span>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
              <a href="#features" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-300">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-300">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-300">Pricing</a>
              <a href="#contact" className="text-gray-300 hover:text-indigo-400 px-3 py-2 text-sm font-medium transition-colors duration-300">Contact</a>
            </div>
            
            {image ? (
              <div className='p-2'>
                <img src={image} alt="User" className=" w-10 rounded-full" /> 

              </div>
            ) : (

              <div className="flex items-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-300"
                >
                  <button 
                    onClick={handlelogin}
                  >
                  Get Started
                  </button>
                </motion.button>
              </div>
            )}
            
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                The Ultimate <span className="text-indigo-400">Video Upload</span> Solution for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Editors & YouTubers</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8">
                Uploadify simplifies your video workflow with lightning-fast uploads, cloud storage, and seamless YouTube integration. Focus on creating amazing content while we handle the technical stuff.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-all duration-300"
                >
                  <button
                    onClick={handlestart}
                  >

                    Start Uploading Now
                  </button>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-indigo-600 text-indigo-400 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-800 transition-all duration-300"
                >
                  Watch Demo
                </motion.button>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <div className="relative">
              <motion.div 
                whileHover={{ y: -10 }}
                className="bg-gray-800 p-4 rounded-xl shadow-2xl border border-gray-700"
              >
                <div className="bg-gray-700 h-64 rounded-lg flex items-center justify-center overflow-hidden">
                  <motion.div
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <FaUpload className="h-16 w-16 text-indigo-400" />
                  </motion.div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
                    ></motion.div>
                  </div>
                  <span className="ml-4 text-sm text-gray-400">45%</span>
                </div>
                <div className="mt-4 flex justify-between text-sm text-gray-400">
                  <span>video_edit_final.mp4</span>
                  <span>2.4 GB</span>
                </div>
              </motion.div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-gray-800 p-4 rounded-xl shadow-lg w-32 h-32 flex items-center justify-center border border-gray-700"
              >
                <FaYoutube className="h-10 w-10 text-red-500" />
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Everything you need to streamline your video upload process and content creation workflow.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaEdit className="h-6 w-6 text-indigo-400" />,
                title: "Editor-Friendly",
                desc: "Direct uploads from editing software with automatic format conversion and quality preservation."
              },
              {
                icon: <FaYoutube className="h-6 w-6 text-indigo-400" />,
                title: "YouTube Integration",
                desc: "One-click upload to YouTube with automatic title, description, and tag suggestions."
              },
              {
                icon: <FaShieldAlt className="h-6 w-6 text-indigo-400" />,
                title: "Secure Storage",
                desc: "Encrypted cloud storage with version history and team collaboration features."
              },
              {
                icon: <FaChartLine className="h-6 w-6 text-indigo-400" />,
                title: "Analytics",
                desc: "Track upload performance, storage usage, and audience engagement metrics."
              },
              {
                icon: <FaServer className="h-6 w-6 text-indigo-400" />,
                title: "High-Speed Transfers",
                desc: "Multi-threaded uploads with pause/resume functionality and bandwidth control."
              },
              {
                icon: <FaEdit className="h-6 w-6 text-indigo-400" />,
                title: "Batch Processing",
                desc: "Upload multiple videos simultaneously with automated naming and organization."
              }
            ].map((feature, index) => (
              <FadeIn key={index} delay={0.1 * index}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gray-700 p-6 rounded-xl border border-gray-600 hover:border-indigo-400 transition-all duration-300"
                >
                  <div className="bg-gray-800 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">
                    {feature.desc}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How Uploadify Works</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Get your videos from your editing suite to your audience in just a few clicks.
              </p>
            </div>
          </FadeIn>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              "Export from Editor",
              "Drag & Drop",
              "Add Details",
              "Upload & Share"
            ].map((step, index) => (
              <FadeIn key={index} delay={0.2 * index}>
                <div className="text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border border-indigo-400"
                  >
                    <span className="text-indigo-400 font-bold text-xl">{index + 1}</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{step}</h3>
                  <p className="text-gray-400">
                    {step === "Export from Editor" && "Export your final video from Premiere, Final Cut, or DaVinci Resolve"}
                    {step === "Drag & Drop" && "Drag your video file into Uploadify or select from your file browser"}
                    {step === "Add Details" && "Add title, description, tags, and select destination (YouTube, storage, etc.)"}
                    {step === "Upload & Share" && "Let Uploadify handle the upload and share the link with your audience"}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold mb-6">Ready to Simplify Your Video Workflow?</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-3xl mx-auto">
              Join thousands of video editors and YouTubers who save hours every week with Uploadify.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg"
            > 
              <button
              onClick={handlestart}
              >
              Get Started for Free
              </button>
            </motion.button>
          </FadeIn>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <FadeIn>
              <div>
                <div className="flex items-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <FaUpload className="h-8 w-8 text-indigo-400" />
                  </motion.div>
                  <span className="ml-2 text-xl font-bold">Uploadify</span>
                </div>
                <p className="text-gray-400">
                  The ultimate video upload solution for content creators and editors.
                </p>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">API</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Integrations</a></li>
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Tutorials</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Support</a></li>
                </ul>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <div id="contact">
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p className="text-gray-400 mb-4">Have questions? We're here to help.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300"
                >
                  Contact Support
                </motion.button>
              </div>
            </FadeIn>
          </div>
          
          <FadeIn>
            <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">© {new Date().getFullYear()} Uploadify. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {['twitter', 'youtube', 'instagram'].map((social, index) => (
                  <motion.a 
                    key={social}
                    whileHover={{ y: -3 }}
                    href="#" 
                    className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                  >
                    <span className="sr-only">{social}</span>
                    <i className={`fab fa-${social} text-xl`}></i>
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
};

export default UploadifyLanding;