import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from './Navigation';
import { ArrowRight, Leaf, Globe, Users, Heart, Shield, Lightbulb } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  const coreValues = [
    {
      icon: <Users className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: "Community",
      description: "Change begins with people coming together, learning from each other, and supporting collective action."
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: "Sustainability",
      description: "Our words and actions are guided by the need to protect the planet and build systems that nurture rather than harm."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: "Justice",
      description: "We stand for equity, recognizing that climate change affects communities differently, and that solutions must be fair and inclusive."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: "Hope & Action",
      description: "We share stories to raise awareness and inspire courage, creativity, and action toward a better future."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-green-50/20 dark:to-green-950/20">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-teal-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="mb-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-1">
                  About Us
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Our voices. Our planet. Our future.
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We believe climate change is part of our daily lives, shaping how we live, work, and connect with one another.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-6 text-lg group"
                  onClick={() => navigate('/contact')}
                >
                  Get in Touch
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              <div className="relative">
                <div className="w-full h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop"
                    alt="Lush green landscape representing our planet"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-900 p-4 rounded-full shadow-lg">
                  <Globe className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* About Description */}
          <Card className="border-2 hover:border-green-500/20 transition-colors">
            <CardContent className="p-8">
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  <strong>My Climate Definition</strong> is a space for stories and conversations about climate change through the lens of our lived experiences. We believe that climate change is part of our daily lives, shaping the way we live, work, and connect with one another.
                </p>
                <p>
                  Here, we share how our values, choices, and everyday actions, along with the systems we create, impact our planet and, in turn, our communities. We hope to make climate change personal, relatable, and urgent by telling our stories.
                </p>
                <p>
                  This platform is about learning together, inspiring change, and reimagining what's possible for our future. We want to spark conversations that empower individuals and communities to see their role in shaping a more sustainable, just, and resilient world for today and for generations to come.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 hover:border-green-500/20 transition-colors hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400 flex items-center gap-3">
                  <Lightbulb className="w-6 h-6" />
                  Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  A world where personal stories and collective experiences inspire action that builds sustainable, resilient, and just communities for present and future generations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-500/20 transition-colors hover:shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600 dark:text-green-400 flex items-center gap-3">
                  <Heart className="w-6 h-6" />
                  Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed">
                  To create a platform that connects daily human choices to global climate impacts and inspires people to reimagine and act toward a more sustainable and resilient future.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <Card className="border-2 hover:border-green-500/20 transition-colors">
            <CardHeader>
              <CardTitle className="text-3xl text-center mb-4">Our Core Values</CardTitle>
              <p className="text-center text-muted-foreground text-lg">
                The principles that guide our work and community
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {coreValues.map((value, index) => (
                  <div 
                    key={index} 
                    className="flex gap-4 p-6 rounded-xl border hover:border-green-500/30 transition-all hover:shadow-md group"
                  >
                    <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Join the Conversation?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you have questions, ideas, or want to share your climate story, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-6 text-lg group"
                onClick={() => navigate('/contact')}
              >
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 px-8 py-6 text-lg"
                onClick={() => navigate('/')}
              >
                Explore Stories
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;