import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
  CheckCircle, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  Smartphone, 
  Globe, 
  ArrowRight,
  Star,
  Mail,
  Bell,
  FileText,
  Settings,
  Eye
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: <FileText className="w-6 h-6" />,
            title: "Multiple Question Types",
            description: "Create surveys with text, radio buttons, checkboxes, dropdowns, email, number, and date inputs."
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Real-time Analytics",
            description: "Get instant insights with detailed analytics and response visualizations."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Public Sharing",
            description: "Share surveys with anyone using unique, secure links that work on any device."
        },
        {
            icon: <Bell className="w-6 h-6" />,
            title: "Smart Notifications",
            description: "Get notified when someone responds to your survey or when it's completed."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure & Private",
            description: "Your data is protected with industry-standard security and privacy measures."
        },
        {
            icon: <Smartphone className="w-6 h-6" />,
            title: "Mobile Responsive",
            description: "Surveys look great and work perfectly on desktop, tablet, and mobile devices."
        }
    ];

    const benefits = [
        "Create unlimited surveys",
        "Collect responses in real-time",
        "Export data to CSV",
        "Custom branding options",
        "Advanced analytics dashboard",
        "Email notifications",
        "24/7 availability",
        "No technical knowledge required"
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Marketing Manager",
            content: "QuickForm has revolutionized how we collect customer feedback. The analytics are incredible!",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Research Director",
            content: "The ease of creating and sharing surveys has made our research process so much more efficient.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Event Coordinator",
            content: "Perfect for event planning! The real-time notifications help us stay on top of responses.",
            rating: 5
        }
    ];

    return (
        <>
            <Head title="QuickForm - Create Beautiful Surveys in Minutes">
                <meta name="description" content="Create professional surveys, collect responses, and analyze data with QuickForm. The easiest way to gather insights from your audience." />
            </Head>

            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-primary">QuickForm</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('admin.dashboard')}
                                    className="d-btn d-btn-primary"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="d-btn d-btn-primary"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Create Beautiful Surveys
                            <span className="text-primary block">in Minutes</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            QuickForm makes it easy to create professional surveys, collect responses, 
                            and analyze data. No technical knowledge required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {auth.user ? (
                                <Link
                                    href={route('admin.dashboard')}
                                    className="d-btn d-btn-primary d-btn-lg"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="d-btn d-btn-primary d-btn-lg"
                                    >
                                        Start Creating Surveys
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="d-btn d-btn-outline d-btn-lg"
                                    >
                                        Learn More
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need to Create Amazing Surveys
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Powerful features designed to make survey creation simple and response collection effective.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="d-card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="d-card-body text-center">
                                    <div className="text-primary mb-4 flex justify-center">
                                        {feature.icon}
                                    </div>
                                    <h3 className="d-card-title justify-center mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Why Choose QuickForm?
                            </h2>
                            <p className="text-xl text-gray-600 mb-8">
                                Join thousands of users who trust QuickForm for their survey needs. 
                                From simple feedback forms to complex research studies, we've got you covered.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="d-card bg-base-100 shadow-xl">
                            <div className="d-card-body">
                                <h3 className="d-card-title mb-4">Get Started Today</h3>
                                <p className="text-gray-600 mb-6">
                                    Create your first survey in minutes. No credit card required.
                                </p>
                                {auth.user ? (
                                    <Link href={route('admin.dashboard')} className="d-btn d-btn-primary w-full">
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link href={route('register')} className="d-btn d-btn-primary w-full">
                                        Create Free Account
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Loved by Survey Creators
                        </h2>
                        <p className="text-xl text-gray-600">
                            See what our users have to say about QuickForm
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="d-card bg-base-100 shadow-xl">
                                <div className="d-card-body">
                                    <div className="flex mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-warning fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Create Your First Survey?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of users who are already creating amazing surveys with QuickForm.
                    </p>
                    {auth.user ? (
                        <Link href={route('admin.dashboard')} className="d-btn d-btn-secondary d-btn-lg">
                            Go to Dashboard
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    ) : (
                        <Link href={route('register')} className="d-btn d-btn-secondary d-btn-lg">
                            Get Started Free
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">QuickForm</h3>
                            <p className="text-gray-400">
                                The easiest way to create professional surveys and collect responses.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white">Features</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-white">Templates</a></li>
                                <li><a href="#" className="hover:text-white">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Help Center</a></li>
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">Documentation</a></li>
                                <li><a href="#" className="hover:text-white">Status</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 QuickForm. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
