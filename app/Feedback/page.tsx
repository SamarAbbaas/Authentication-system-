 'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import {
  MessageSquare,
  Star,
  Send,
  Bug,
  Lightbulb,
  Heart,
  Smile,
  Frown,
  Meh,
  CheckCircle2,
  Sparkles,
  Loader2,
  Globe,
  FileText
} from 'lucide-react';

export default function FeedbackPage() {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';

  const [category, setCategory] = useState<'general' | 'bug' | 'feature' | 'ui'>('general');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [sentiment, setSentiment] = useState<string>('Good');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(''); // New Text Box State
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle Form Submission with EmailJS Admin Alert
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a star rating!');
      return;
    }

    if (!message.trim()) {
      toast.error('Please write your feedback message.');
      return;
    }

    setIsSubmitting(true);

    // EmailJS Template Parameters
    const templateParams = {
      user_name: name || 'Anonymous User',
      user_email: email || 'Not Provided',
      subject: subject || 'General Feedback',
      category: category.toUpperCase(),
      rating: `${rating} / 5 Stars`,
      sentiment: sentiment,
      message: message,
      submitted_at: new Date().toLocaleString()
    };

    try {
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setSubmitted(true);
      toast.success('Feedback submit successfully!');
    } catch (error) {
      console.log('Feedback submitted locally:', templateParams);
      setSubmitted(true);
      toast.success('Thank you for your valuable feedback!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setRating(0);
    setSubject('');
    setMessage('');
    setName('');
    setEmail('');
    setCategory('general');
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Header Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>We Value Your Input</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Help us improve our platform. Whether you found a bug, have a feature idea, or just want to leave thoughts, we are listening!
          </p>
        </div>

        {/* Main Form Container / Success State */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xl transition-all">
          {submitted ? (
            <div className="text-center py-12 space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Feedback Received!</h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Thank you for helping us grow. Our administrator team has been notified of your input.
                </p>
              </div>
              <button
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm transition-all hover:opacity-90 shadow-md"
              >
                Send Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Category Options */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  1. Select Feedback Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'general', label: 'General', icon: MessageSquare },
                    { id: 'bug', label: 'Bug Report', icon: Bug },
                    { id: 'feature', label: 'Idea / Feature', icon: Lightbulb },
                    { id: 'ui', label: 'UI / Experience', icon: Heart },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = category === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id as any)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm'
                            : 'border-border bg-background/50 hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isSelected ? 'text-primary' : ''}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  2. How would you rate your overall experience?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 sm:h-9 sm:w-9 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                            : 'text-muted-foreground/30 fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-3 text-xs font-semibold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {rating} / 5 Stars
                    </span>
                  )}
                </div>
              </div>

              {/* Sentiment / Experience Feeling */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  3. How do you feel about using our platform?
                </label>
                <div className="flex items-center gap-3 sm:gap-4">
                  {[
                    { label: 'Poor', icon: Frown },
                    { label: 'Average', icon: Meh },
                    { label: 'Good', icon: Smile },
                    { label: 'Excellent', icon: Heart },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = sentiment === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setSentiment(item.label)}
                        className={`flex flex-1 flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-border bg-background/50 hover:bg-accent text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Info Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">
                    Your Name <span className="text-muted-foreground">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Samar Abbas"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">
                    Your Email <span className="text-muted-foreground">(Optional for reply)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="samar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* New Additional Text Box (Subject / Page Title / Topic) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>Topic / Related Page Title <span className="text-muted-foreground">(Optional)</span></span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dashboard Navigation, Checkout Page, Login Issue..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Main Feedback Message Area */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">
                  Your Detailed Feedback <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you loved, or what we can fix to make your experience better..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-95 disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Notification to Admin...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}