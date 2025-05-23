'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Users2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type Technician = {
  id: string;
  name: string;
  imageUrl: string;
  specialty: string;
  rating: number;
  totalReviews: number;
};

export default function CreateReviewPage() {
  const router = useRouter();

  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loadingTechs, setLoadingTechs] = useState(true);

  const [technicianId, setTechnicianId] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      setLoadingTechs(true);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/technician-ratings`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error('Failed to fetch technicians');
        const data = await res.json();

        const tList: Technician[] = data.map((t: any) => ({
          id: t.technicianId,
          name: t.fullName,
          imageUrl: t.profilePhoto ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=random`,
          specialty: t.specialization || 'General Technician',
          rating: t.averageRating || 0,
          totalReviews: t.totalReviews || 0,
        }));
        setTechnicians(tList);
      } catch {
        toast.error('Failed to load technicians!');
      } finally {
        setLoadingTechs(false);
      }
    };
    fetchTechnicians();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!technicianId) {
      setError('Please select a technician.');
      return;
    }
    if (!rating) {
      setError('Please provide a rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a comment.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login again.');
      setSubmitting(false);
      toast.error('Token login not found.');
      return;
    }

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_REVIEW_API_URL}/review`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          technicianId,
          comment,
          rating,
        }),
      });
      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || 'Failed to send review');
      }
      toast.success('Review sent!');
      router.push('/dashboard/reviews');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to send review');
      toast.error('Failed to send review.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          type="button"
          aria-label={`Rate ${star} star`}
          key={star}
          disabled={submitting}
          className="focus:outline-none"
          onClick={() => setRating(star)}
        >
          <Star
            className={`w-7 h-7 transition ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <motion.div
        className="w-full max-w-2xl px-4 py-8 md:py-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8 flex items-center">
          <Link
            href="/dashboard/reviews"
            className="text-primary hover:text-primary/90 mr-4 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Reviews</span>
          </Link>
        </div>

        <Card className="rounded-lg border border-border bg-card shadow-sm">
          <CardHeader className="text-center flex flex-col items-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                <Users2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Review Form</CardTitle>
            <p className="text-muted-foreground text-sm mt-2 max-w-md">
                Leave a review for your technician!
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="block mb-2 font-semibold">Pick Technician</Label>
                {loadingTechs ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : technicians.length === 0 ? (
                  <div className="text-red-600 text-sm">No technicians found.</div>
                ) : (
                  <div className="grid gap-3">
                    {technicians.map((tech) => (
                      <div
                        key={tech.id}
                        className={`flex items-center gap-3 border rounded px-3 py-2 cursor-pointer transition relative
                          ${technicianId === tech.id ? 'border-primary ring-1 ring-primary' : 'hover:border-muted-foreground/50'}
                          ${submitting && 'opacity-40 pointer-events-none'}
                        `}
                        onClick={() => setTechnicianId(tech.id)}
                        tabIndex={0}
                        aria-pressed={technicianId === tech.id}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={tech.imageUrl} alt={tech.name} />
                          <AvatarFallback>{tech.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex gap-2 items-center">
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-yellow-500 text-xs">★{tech.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground text-xs">({tech.totalReviews})</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{tech.specialty}</span>
                        </div>
                        {technicianId === tech.id && (
                          <span className="ml-2 text-primary text-lg font-bold">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label className="block mb-2 font-semibold">Rating</Label>
                <StarRating />
              </div>
              <div>
                <Label className="block mb-2 font-semibold">Comment/Feedback</Label>
                <Textarea
                  disabled={submitting}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full border rounded p-2 min-h-[80px]"
                  placeholder="Describe your experience…"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!technicianId || !rating || !comment || submitting}>
                  {submitting ? 'Submitting...' : 'Send Review'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}